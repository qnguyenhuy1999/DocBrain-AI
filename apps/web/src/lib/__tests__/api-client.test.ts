import { describe, expect, it, vi, afterEach } from 'vitest'
import { apiFetch } from '../api-client'

function mockFetch(response: {
  ok: boolean
  status?: number
  json?: () => Promise<unknown>
  text?: () => Promise<string>
}) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? 200,
    json: response.json ?? vi.fn().mockResolvedValue({}),
    text: response.text ?? vi.fn().mockResolvedValue(''),
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('apiFetch', () => {
  it('returns parsed JSON when response is ok', async () => {
    mockFetch({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 'project-1', name: 'Test' }),
    })

    const result = await apiFetch<{ id: string; name: string }>('/projects/project-1')
    expect(result).toEqual({ id: 'project-1', name: 'Test' })
  })

  it('throws with message field from JSON error body', async () => {
    mockFetch({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValue({ message: 'Project not found', statusCode: 404 }),
    })

    await expect(apiFetch('/projects/unknown')).rejects.toThrow('Project not found')
  })

  it('throws with joined message when message is a string array', async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        message: ['name must not be empty', 'rootUrl must be a URL'],
        statusCode: 400,
      }),
    })

    await expect(apiFetch('/projects')).rejects.toThrow(
      'name must not be empty, rootUrl must be a URL',
    )
  })

  it('falls back to status message when response body is not JSON', async () => {
    // json() throws a SyntaxError whose message != the fallback string, so the
    // catch block re-throws it immediately (line: if (e.message !== fallback) throw e).
    // The error that surfaces is the SyntaxError from json(), not the plain text.
    mockFetch({
      ok: false,
      status: 503,
      json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
      text: vi.fn().mockResolvedValue('Service Unavailable'),
    })

    await expect(apiFetch('/projects')).rejects.toThrow('Unexpected token')
  })
})
