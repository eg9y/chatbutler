import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post(':id')
  async triggerChatSequence(
    @Param('id') id: string,
    @Body()
    body: {
      sessionId: string;
      userResponse: string;
      previousBlockId: string;
    },
  ) {
    await this.chatbotService.triggerChatSequence(id, body.sessionId, body);
    return { message: 'Chat sequence triggered' };
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
