import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RetrievalModule } from '../retrieval/retrieval.module'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { AnswerGeneratorService } from './services/answer-generator.service'
import { CitationBuilderService } from './services/citation-builder.service'
import { PromptBuilderService } from './services/prompt-builder.service'

@Module({
  imports: [DatabaseModule, RetrievalModule],
  controllers: [ChatController],
  providers: [ChatService, PromptBuilderService, AnswerGeneratorService, CitationBuilderService],
})
export class ChatModule {}
