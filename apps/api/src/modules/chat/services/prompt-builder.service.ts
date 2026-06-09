import type { RetrievalMatch } from '@docbrain/types'
import { Injectable } from '@nestjs/common'

const MAX_CONTEXT_CHARS = 28_000

export interface PromptBuildResult {
  systemPrompt: string
  userPrompt: string
  matches: RetrievalMatch[]
}

@Injectable()
export class PromptBuilderService {
  build(question: string, matches: RetrievalMatch[]): PromptBuildResult {
    const selectedMatches: RetrievalMatch[] = []
    let totalChars = 0

    for (const match of matches) {
      const block = this.formatMatch(match, selectedMatches.length + 1)
      if (selectedMatches.length > 0 && totalChars + block.length > MAX_CONTEXT_CHARS) {
        break
      }

      selectedMatches.push(match)
      totalChars += block.length
    }

    const context = selectedMatches.map((match, index) => this.formatMatch(match, index + 1)).join('\n\n')

    return {
      systemPrompt:
        'You are DocBrain AI. Answer only using the provided documentation context. If the context does not contain the answer, say you do not know based on the indexed docs. Do not invent APIs, configs, or behaviors. Cite sources using bracketed numbers like [1] that match the provided context blocks.',
      userPrompt: `Question:\n${question}\n\nContext:\n${context}\n\nRules:\n- Use only the context above.\n- If the answer is missing, say you do not know based on the indexed docs.\n- Keep citations aligned with the context block numbers.`,
      matches: selectedMatches,
    }
  }

  private formatMatch(match: RetrievalMatch, index: number): string {
    const url = match.sourceUrl ?? 'N/A'
    const section = match.section ?? 'General'

    return `[${index}] Title: ${match.title}
Section: ${section}
URL: ${url}
Score: ${match.score.toFixed(3)}
Content:
${match.content}`
  }
}
