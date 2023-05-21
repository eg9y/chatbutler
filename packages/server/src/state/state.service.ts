import { Injectable } from '@nestjs/common';
import {
  CustomNode,
  FlowEdgeType,
  getNodes,
  initializeFlowState,
  Inputs,
  NodeTypesEnum,
} from 'shared';
import { RedisService } from 'src/redis/redis.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { TraversalStateType } from '../../../shared/src/traversalStateType';
import { WorkflowDbSchema } from '../../../shared/src/types/dbTypes';

@Injectable()
export class StateService {
  constructor(
    private readonly redisService: RedisService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async loadExistingChatSession(
    sessionId: string,
    state: TraversalStateType,
    body: { userResponse: string; previousBlockId: string },
  ) {
    const redisKey = `chat_session:${sessionId}`;
    const chatSessionData = await this.redisService.redisClient.get(redisKey);
    const parsedChatSessionData = JSON.parse(chatSessionData);
    state.stack = parsedChatSessionData.chatbot.stack;
    state.nodes = parsedChatSessionData.chatbot.nodes;
    state.edges = parsedChatSessionData.chatbot.edges;
    state.visited = new Set(parsedChatSessionData.chatbot.visited);
    state.skipped = new Set(parsedChatSessionData.chatbot.skipped);
    state.chatHistory = parsedChatSessionData.chatbot.chatHistory;

    // 1.3a if previous block is input, then update the input response value
    const previousNode = getNodes(state.nodes, [body.previousBlockId])[0];
    if (previousNode.type === NodeTypesEnum.inputText) {
      state.nodes = state.nodes.map((node) => {
        if (node.id === body.previousBlockId) {
          node.data.response = body.userResponse;
        }
        return node;
      });
    }
    return state;
  }

  async loadNewChatSession(sessionId: string, state: TraversalStateType) {
    // 1.2b fetch chatbot from Supabase
    const supabase = this.supabaseService.getSupabaseClient();
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', sessionId)
      .single<WorkflowDbSchema>();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Chatbot not found.');
    }
    console.log('chatbot', data);

    // 1.3b create new chat session in Redis
    const { parsedNodes, parsedEdges } = this.loadGraph(data);
    const newState = initializeFlowState(parsedNodes, parsedEdges);
    state.stack = newState.stack;
    state.nodes = newState.nodes;
    state.edges = newState.edges;
    state.visited = newState.visited;
    state.skipped = newState.skipped;
    state.chatHistory = newState.chatHistory;
  }

  loadGraph(data: WorkflowDbSchema) {
    let parsedNodes: CustomNode[] = [];
    let parsedEdges: FlowEdgeType[] = [];

    if (typeof data.nodes === 'string') {
      parsedNodes = JSON.parse(data.nodes as string).map((node: CustomNode) => {
        if ('inputs' in node.data) {
          return {
            ...node,
            data: {
              ...node.data,
              inputs: new Inputs(
                node.data.inputs.inputs,
                node.data.inputs.inputExamples,
              ),
            },
          };
        }
        return {
          ...node,
        };
      });
    } else {
      parsedNodes = (data.nodes as unknown as CustomNode[]).map(
        (node: CustomNode) => {
          if ('inputs' in node.data) {
            return {
              ...node,
              data: {
                ...node.data,
                inputs: new Inputs(
                  node.data.inputs.inputs,
                  node.data.inputs.inputExamples,
                ),
              },
            };
          }
          return {
            ...node,
          };
        },
      );
    }
    if (typeof data.edges === 'string') {
      parsedEdges = JSON.parse(data.edges as string);
    } else {
      parsedEdges = data.edges as unknown as FlowEdgeType[];
    }
    return { parsedNodes, parsedEdges };
  }
}
