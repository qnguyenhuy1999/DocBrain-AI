import type { ChatResponse, Conversation, Message } from '@docbrain/types'
import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { parseCreateConversationDto } from './dto/create-conversation.dto'
import { parseSendMessageDto } from './dto/send-message.dto'
import { ChatService } from './chat.service'

@Controller()
export class ChatController {
  constructor(@Inject(ChatService) private readonly chatService: ChatService) {}

  @Post('projects/:projectId/conversations')
  async createConversation(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() body?: unknown,
  ): Promise<Conversation> {
    const input = parseCreateConversationDto(body)
    return this.chatService.createConversation(projectId, input.title)
  }

  @Get('projects/:projectId/conversations')
  async listProjectConversations(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ): Promise<Conversation[]> {
    return this.chatService.listProjectConversations(projectId)
  }

  @Get('conversations/:conversationId/messages')
  async getConversationMessages(
    @Param('conversationId', new ParseUUIDPipe()) conversationId: string,
  ): Promise<Message[]> {
    return this.chatService.getConversationMessages(conversationId)
  }

  @Post('conversations/:conversationId/messages')
  async sendMessage(
    @Param('conversationId', new ParseUUIDPipe()) conversationId: string,
    @Body() body?: unknown,
  ): Promise<ChatResponse> {
    const input = parseSendMessageDto(body)
    return this.chatService.sendMessage(conversationId, input.message)
  }
}
