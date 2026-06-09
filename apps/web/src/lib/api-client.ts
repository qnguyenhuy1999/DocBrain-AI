import type {
  ChatResponse,
  Chunk,
  Conversation,
  DocumentListItem,
  IndexProjectDto,
  IndexProjectResponse,
  Message,
  ProjectOverview,
  RetrieveResponse,
} from '@docbrain/types'
import type {
  CreateConversationInput,
  CreateProjectInput,
  RetrieveInput,
  SendMessageInput,
} from '@docbrain/validators'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type ApiErrorBody = {
  message?: string | string[]
  error?: string
  statusCode?: number
}

function formatApiError(body: ApiErrorBody, fallback: string): string {
  if (Array.isArray(body.message)) return body.message.join(', ')
  if (body.message) return body.message
  if (body.error) return body.error
  return fallback
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const fallback = `Request failed with ${response.status}`
    try {
      const body = (await response.json()) as ApiErrorBody
      throw new Error(formatApiError(body, fallback))
    } catch (e) {
      if (e instanceof Error && e.message !== fallback) throw e
      const text = await response.text().catch(() => '')
      throw new Error(text || fallback)
    }
  }

  return response.json() as Promise<T>
}

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null
  }

  return value instanceof Date ? value : new Date(value)
}

function normalizeProject(project: ProjectOverview): ProjectOverview {
  return {
    ...project,
    createdAt: toDate(project.createdAt) ?? new Date(),
    updatedAt: toDate(project.updatedAt) ?? new Date(),
    lastIndexedAt: toDate(project.lastIndexedAt),
  }
}

function normalizeDocument(document: DocumentListItem): DocumentListItem {
  return {
    ...document,
    createdAt: toDate(document.createdAt) ?? new Date(),
    updatedAt: toDate(document.updatedAt) ?? new Date(),
    indexedAt: toDate(document.indexedAt),
  }
}

function normalizeChunk(chunk: Chunk): Chunk {
  return {
    ...chunk,
    createdAt: toDate(chunk.createdAt) ?? new Date(),
  }
}

function normalizeConversation(conversation: Conversation): Conversation {
  return {
    ...conversation,
    createdAt: toDate(conversation.createdAt) ?? new Date(),
    updatedAt: toDate(conversation.updatedAt) ?? new Date(),
  }
}

function normalizeMessage(message: Message): Message {
  return {
    ...message,
    createdAt: toDate(message.createdAt) ?? new Date(),
  }
}

export const apiClient = {
  async createProject(input: CreateProjectInput): Promise<ProjectOverview> {
    const project = await apiFetch<ProjectOverview>('/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return normalizeProject(project)
  },
  async listProjects(): Promise<ProjectOverview[]> {
    const projects = await apiFetch<ProjectOverview[]>('/projects')
    return projects.map(normalizeProject)
  },
  async getProject(projectId: string): Promise<ProjectOverview> {
    const project = await apiFetch<ProjectOverview>(`/projects/${projectId}`)
    return normalizeProject(project)
  },
  async indexProject(projectId: string, input: IndexProjectDto = {}): Promise<IndexProjectResponse> {
    return apiFetch<IndexProjectResponse>(`/projects/${projectId}/index`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  async listDocuments(projectId: string): Promise<DocumentListItem[]> {
    const documents = await apiFetch<DocumentListItem[]>(`/projects/${projectId}/documents`)
    return documents.map(normalizeDocument)
  },
  async listChunks(projectId: string, documentId?: string): Promise<Chunk[]> {
    const params = documentId ? `?documentId=${encodeURIComponent(documentId)}` : ''
    const chunks = await apiFetch<Chunk[]>(`/projects/${projectId}/chunks${params}`)
    return chunks.map(normalizeChunk)
  },
  async retrieve(projectId: string, input: RetrieveInput): Promise<RetrieveResponse> {
    return apiFetch<RetrieveResponse>(`/projects/${projectId}/retrieve`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  async createConversation(
    projectId: string,
    input: CreateConversationInput = {},
  ): Promise<Conversation> {
    const conversation = await apiFetch<Conversation>(`/projects/${projectId}/conversations`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return normalizeConversation(conversation)
  },
  async listConversations(projectId: string): Promise<Conversation[]> {
    const conversations = await apiFetch<Conversation[]>(`/projects/${projectId}/conversations`)
    return conversations.map(normalizeConversation)
  },
  async listMessages(conversationId: string): Promise<Message[]> {
    const messages = await apiFetch<Message[]>(`/conversations/${conversationId}/messages`)
    return messages.map(normalizeMessage)
  },
  async sendMessage(conversationId: string, input: SendMessageInput): Promise<ChatResponse> {
    const response = await apiFetch<ChatResponse>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(input),
    })

    return {
      ...response,
      userMessage: normalizeMessage(response.userMessage),
      assistantMessage: normalizeMessage(response.assistantMessage),
    }
  },
  async archiveProject(projectId: string): Promise<ProjectOverview> {
    const project = await apiFetch<ProjectOverview>(`/projects/${projectId}/archive`, {
      method: 'POST',
    })
    return normalizeProject(project)
  },
}

export { apiFetch }
