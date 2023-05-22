import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post(':id')
  async startChat(
    @Param('id') id: string,
    @Body()
    body: {
      sessionId: string;
      userResponse: string;
      previousBlockId: string;
    },
  ) {
    return this.chatbotService.startChat(id, body.sessionId, body);
  }

  @Post(':id/heartbeat')
  async heartbeat(
    @Param('id') id: string,
    @Query('session-id') sessionId: string,
  ) {
    return this.chatbotService.heartbeat(id, sessionId);
  }

  @Post()
  create(@Body() createChatbotDto: CreateChatbotDto) {
    return this.chatbotService.create(createChatbotDto);
  }

  @Get()
  findAll() {
    return this.chatbotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatbotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatbotDto: UpdateChatbotDto) {
    return this.chatbotService.update(+id, updateChatbotDto);
  }

  @Delete(':sessionId')
  remove(@Param('sessionId') sessionId: string) {
    return this.chatbotService.remove(sessionId);
  }
}
