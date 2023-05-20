import { PartialType } from '@nestjs/mapped-types';
import { CreateChatbotDto } from './create-chatbot.dto';

export class UpdateChatbotDto extends PartialType(CreateChatbotDto) {}
