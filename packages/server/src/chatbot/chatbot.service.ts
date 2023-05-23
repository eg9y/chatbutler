import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { StateService } from 'src/state/state.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly redisService: RedisService,
    private readonly stateService: StateService,
    private configService: ConfigService,
    @InjectQueue('runNode')
    private runNodeQueue: Queue<{
      sessionId: string;
      chatbotId: string;
      body: {
        userResponse: string;
        previousBlockId: string;
      };
    }>,
  ) {}

  async triggerChatSequence(
    chatbotId: string,
    sessionId: string,
    body: {
      userResponse: string;
      previousBlockId: string;
    },
  ) {
    try {
      const job = await this.runNodeQueue.add('transcode', {
        sessionId,
        chatbotId,
        body,
      });

      return {
        message: 'Job added',
        jobId: job.id,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Unable to start chat',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  async remove(sessionId: string) {
    try {
      await this.redisService.redisClient.del(`chat_session:${sessionId}`);
      return sessionId;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        `Unable to delete chat session: ${sessionId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
