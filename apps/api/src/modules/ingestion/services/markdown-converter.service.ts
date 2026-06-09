import { Injectable } from '@nestjs/common'
import TurndownService from 'turndown'

@Injectable()
export class MarkdownConverterService {
  private readonly turndownService = new TurndownService({
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
  })

  convert(html: string): string {
    return this.turndownService
      .turndown(html)
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }
}
