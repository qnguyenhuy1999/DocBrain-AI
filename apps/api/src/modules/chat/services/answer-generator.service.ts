import { CHAT_MAX_OUTPUT_TOKENS, CHAT_MODEL, CHAT_TEMPERATURE } from '@docbrain/config'
import { BadGatewayException, Injectable } from '@nestjs/common'
import OpenAI from 'openai'

@Injectable()
export class AnswerGeneratorService {
  private readonly client = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  })

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const response = await this.client.responses.create({
        model: CHAT_MODEL,
        temperature: CHAT_TEMPERATURE,
        max_output_tokens: CHAT_MAX_OUTPUT_TOKENS,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: systemPrompt }] },
          { role: 'user', content: [{ type: 'input_text', text: userPrompt }] },
        ],
      })

      const content = response.output_text.trim()
      if (!content) {
        throw new Error('AI response was empty')
      }

      return content
    } catch (error) {
      throw new BadGatewayException(
        `AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
