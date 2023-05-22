import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  runNode,
  CustomNode,
  FlowEdgeType,
  initializeFlowState,
  Inputs,
  getNextNode,
  runConditional,
  getNodes,
  NodeTypesEnum,
} from '@chatbutler/shared';

import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { RedisService } from 'src/redis/redis.service';
import { TraversalStateType } from '../../../shared/src/traversalStateType';
import { WorkflowDbSchema } from '../../../shared/src/types/dbTypes';
import { ConfigService } from '@nestjs/config';
import { StateService } from 'src/state/state.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly redisService: RedisService,
    private readonly stateService: StateService,
    private configService: ConfigService,
  ) {}

  async startChat(
    id: string,
    sessionId: string,
    body: {
      userResponse: string;
      previousBlockId: string;
    },
  ) {
    try {
      const redisKey = `chat_session:${sessionId}`;
      const isSessionExists = await this.redisService.redisClient.exists(
        redisKey,
      );

      const state: TraversalStateType | null = null;

      // 1a. if sessionId in Redis, load the chat session
      // 1b. if sessionId not in Redis, create a new chat session
      if (isSessionExists) {
        // 1.2a load chat session from Redis
        await this.stateService.loadExistingChatSession(sessionId, state, body);
      } else {
        await this.stateService.loadNewChatSession(sessionId, state);
      }

      // 2. get next node in chat session
      const nodeId = getNextNode(state, state.nodes); // nodeId is now redefined in each iteration

      // 3. run next node in chat session
      const openAiKey = this.configService.get<string>('OPENAI_API_KEY');
      await runNode(state, id, state.nodes, nodeId, openAiKey, {
        url: this.configService.get<string>('SUPABASE_URL'), 
        key: this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
        functionUrl: ''
      });

      // 4. set executed node as visited
      state.visited.add(nodeId);

      // 5.alter the stack based on flow-altering nodes
      runConditional(state.nodes, state.edges as FlowEdgeType[], nodeId, state);

      // 6.set new chat session in Redis
      await this.redisService.redisClient.set(redisKey, JSON.stringify(state));

      // 7. define message to send
      const node = getNodes(state.nodes, [nodeId])[0];
      let message = '';
      if (node.type === NodeTypesEnum.inputText) {
        message = node.data.text;
      } else if (node.type === NodeTypesEnum.outputText) {
        message = node.data.response;
      }

      return {
        message,
        nextNodeId: nodeId,
        nextNodeType: node.type,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Unable to start chat',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async heartbeat(id: string, sessionId: string) {
    // update the chat session heartbeat
    // remove the chat session entry if no heartbeat received after X seconds
  }

  create(createChatbotDto: CreateChatbotDto) {
    return 'This action adds a new chatbot';
  }

  findAll() {
    return `This action returns all chatbot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatbot`;
  }

  update(id: number, updateChatbotDto: UpdateChatbotDto) {
    return `This action updates a #${id} chatbot`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatbot`;
  }
}
