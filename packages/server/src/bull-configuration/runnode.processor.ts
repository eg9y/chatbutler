import { Processor, Process, OnQueueError, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { ChatGateway } from '../chatbot/chatbot.gateway';
import {
  runConditional,
  FlowEdgeType,
  getNodes,
  NodeTypesEnum,
  runNode,
  getNextNode,
  initializeFlowState,
} from '@chatbutler/shared';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { StateService } from 'src/state/state.service';
import { TraversalStateType } from '../../../shared/src/traversalStateType';

@Processor('runNode')
export class RunNodeProcessor {
  constructor(
    private chatGateway: ChatGateway,
    private redisService: RedisService,
    private configService: ConfigService,
    private stateService: StateService,
  ) {}

  @OnQueueError()
  errorHandler(error: Error) {
    console.error(`Error in queue: `, error);
  }

  @OnQueueFailed()
  failedHandler(job: Job, error: Error) {
    console.error(`Job ${job.id} failed: `, error);
    // Send update via WebSocket
    this.chatGateway.sendUpdate(job.data.sessionId, { error: error.message });
  }

  @Process('transcode')
  async transcode(
    job: Job<{
      sessionId: string;
      chatbotId: string;
      body: {
        userResponse: string;
        previousBlockId: string;
      };
    }>,
  ) {
    const { chatbotId, body, sessionId } = job.data;
    try {
      const redisKey = `chat_session:${sessionId}`;
      const isSessionExists = await this.redisService.redisClient.exists(
        redisKey,
      );
      const state: TraversalStateType = initializeFlowState([], []);

      if (isSessionExists === 1) {
        await this.stateService.loadExistingChatSession(sessionId, state, body);
      } else {
        await this.stateService.loadNewChatSession(chatbotId, state);
      }

      const nodeId = getNextNode(state, state.nodes);

      const openAiKey = this.configService.get<string>('OPENAI_API_KEY');
      // Get relevant data from job data
      await runNode(state, chatbotId, state.nodes, nodeId, openAiKey, {
        url: this.configService.get<string>('SUPABASE_URL'),
        key: this.configService.get<string>('SUPABASE_SERVICE_ROLE'),
        functionUrl: '',
      });

      // Your logic here
      state.visited.add(nodeId);
      runConditional(state.nodes, state.edges as FlowEdgeType[], nodeId, state);

      // 6.set new chat session in Redis
      const compatibleState = {
        ...state,
        visited: Array.from(state.visited),
        skipped: Array.from(state.skipped),
      };
      await this.redisService.redisClient.set(
        redisKey,
        JSON.stringify(compatibleState),
      );

      const node = getNodes(state.nodes, [nodeId])[0];
      let message = '';
      if (node.type === NodeTypesEnum.inputText) {
        message = node.data.text;
      } else if (node.type === NodeTypesEnum.outputText) {
        message = node.data.response;
      }

      const returnMessage = {
        message,
        nextNodeId: nodeId,
        nextNodeType: node.type,
      };

      // Send update via WebSocket
      this.chatGateway.sendUpdate(sessionId, returnMessage);
    } catch (error) {
      console.error(error);
      console.error('error message:', error.message);
      this.chatGateway.sendUpdate(sessionId, { error: error.message });
    }
  }
}
