import { PrismaClient, DocumentSourceType, MessageRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.embedding.deleteMany()
  await prisma.chunk.deleteMany()
  await prisma.document.deleteMany()
  await prisma.project.deleteMany()

  // Create a demo project
  const project = await prisma.project.create({
    data: {
      name: 'DocBrain Documentation',
      description: 'Official DocBrain AI product documentation',
      rootUrl: 'https://docs.docbrain.ai',
    },
  })

  console.log(`Created project: ${project.name} (${project.id})`)

  // Create a sample document
  const document = await prisma.document.create({
    data: {
      projectId: project.id,
      title: 'Getting Started with DocBrain',
      sourceType: DocumentSourceType.URL,
      sourceUrl: 'https://docs.docbrain.ai/getting-started',
      markdown:
        '# Getting Started with DocBrain\n\nDocBrain AI helps teams ingest and search documentation.',
      contentHash: 'demo-docbrain-getting-started',
      status: 'READY',
      indexedAt: new Date(),
    },
  })

  console.log(`Created document: ${document.title} (${document.id})`)

  // Create sample chunks
  const chunks = await Promise.all([
    prisma.chunk.create({
      data: {
        documentId: document.id,
        content:
          'DocBrain AI is a powerful documentation intelligence platform that allows you to ingest, search, and query your documentation using natural language.',
        section: 'Introduction',
        tokenCount: 32,
        chunkIndex: 0,
        startOffset: 0,
        endOffset: 147,
        metadata: { source: 'seed' },
      },
    }),
    prisma.chunk.create({
      data: {
        documentId: document.id,
        content:
          'To get started, create a project and add your documentation sources. DocBrain supports URLs, file uploads, and manual text entry.',
        section: 'Quick Start',
        tokenCount: 28,
        chunkIndex: 1,
        startOffset: 148,
        endOffset: 276,
        metadata: { source: 'seed' },
      },
    }),
    prisma.chunk.create({
      data: {
        documentId: document.id,
        content:
          'Once your documents are ingested, you can start a conversation with your documentation using the chat interface.',
        section: 'Usage',
        tokenCount: 24,
        chunkIndex: 2,
        startOffset: 277,
        endOffset: 386,
        metadata: { source: 'seed' },
      },
    }),
  ])

  console.log(`Created ${chunks.length} chunks`)

  // Create a sample conversation
  const conversation = await prisma.conversation.create({
    data: {
      projectId: project.id,
      title: 'Getting started questions',
    },
  })

  console.log(`Created conversation: ${conversation.title} (${conversation.id})`)

  // Create sample messages
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: 'What is DocBrain AI?',
      },
    }),
    prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content:
          'DocBrain AI is a powerful documentation intelligence platform that allows you to ingest, search, and query your documentation using natural language.',
        citations: [{ chunkId: chunks[0].id, score: 0.97 }],
      },
    }),
    prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: 'How do I get started?',
      },
    }),
    prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content:
          'To get started, create a project and add your documentation sources. DocBrain supports URLs, file uploads, and manual text entry.',
        citations: [{ chunkId: chunks[1].id, score: 0.94 }],
      },
    }),
  ])

  console.log(`Created ${messages.length} messages`)

  console.log('Seeding complete.')
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
