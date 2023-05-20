import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { runNode } from 'shared';

import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { RedisService } from 'src/redis/redis.service';
import { CustomNode, Edge } from 'src/types/Node';
import { Message } from 'src/types/Db';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly redisService: RedisService,
  ) {}

  async startChat(id: string, sessionId: string, body: any) {
    try {
      // if sessionId not in Redis, create a new chat session
      // if sessionId in Redis, load the chat session

      let nodes: CustomNode[] = [];
      let edges: Edge[] = [];
      let visited: Set<string> = new Set([]);
      let skipped: Set<string> = new Set([]);
      let chatHistory: Message[];

      const isSessionExists = await this.redisService.redisClient.exists(
        `chat_session:${sessionId}`,
      );

      if (isSessionExists) {
        // load the chat session from Redis
        const redisKey = `chat_session:${sessionId}`;
        const chatSessionData = await this.redisService.redisClient.get(
          redisKey,
        );
        const parsedChatSessionData = JSON.parse(chatSessionData);

        nodes = parsedChatSessionData.chatbot.nodes;
        edges = parsedChatSessionData.chatbot.edges;
        visited = parsedChatSessionData.visited;
        skipped = parsedChatSessionData.skipped;
        chatHistory = parsedChatSessionData.chatHistory;
      } else {
        // fetch the chatbot entry from Supabase
        const supabase = this.supabaseService.getSupabaseClient();
        const { data, error } = await supabase
          .from('workflows')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Chatbot not found.');
        }
        console.log('chatbot', data);
        // create a new chat session entry in Redis
        const redisKey = `chat_session:${sessionId}`;
        const chatSessionData = {
          chatbot: data,
          visited: visited,
          skipped: skipped,
          chatHistory: chatHistory,
        };

        await this.redisService.redisClient.set(
          redisKey,
          JSON.stringify(chatSessionData),
        );

        // const { parsedNodes, parsedEdges } = getChatbot(data);
        // nodes = parsedNodes;
        // edges = parsedEdges;
      }

      // run the tree traversal
      // update the chat session history
      // await this.utilityService.runNextNode(
      //   sessionId,
      //   nodes,
      //   edges,
      //   visited,
      //   skipped,
      //   chatHistory,
      // );

      // const nextNode = await this.utilityService.findNextNode(
      //   nodes,
      //   edges,
      //   visited,
      //   skipped,
      // );

      return {
        message: 'Chat started successfully',
        // nextNodeType: nextNode.type,
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
