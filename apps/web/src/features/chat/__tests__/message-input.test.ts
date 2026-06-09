import { describe, expect, it, vi } from 'vitest'

// Mirrors the guard logic in MessageInput.handleSubmit:
//   const normalized = message.trim()
//   if (!normalized) return
//   await onSend(normalized)
function simulateSubmit(message: string, onSend: (msg: string) => Promise<void>) {
  const normalized = message.trim()
  if (!normalized) {
    return Promise.resolve()
  }
  return onSend(normalized)
}

describe('MessageInput guard logic', () => {
  it('does not call onSend when message is empty string', async () => {
    const onSend = vi.fn()
    await simulateSubmit('', onSend)
    expect(onSend).not.toHaveBeenCalled()
  })

  it('does not call onSend when message is whitespace only', async () => {
    const onSend = vi.fn()
    await simulateSubmit('   ', onSend)
    expect(onSend).not.toHaveBeenCalled()
  })

  it('does not call onSend when message is tab and newline only', async () => {
    const onSend = vi.fn()
    await simulateSubmit('\t\n  ', onSend)
    expect(onSend).not.toHaveBeenCalled()
  })

  it('calls onSend with trimmed message when message has content', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined)
    await simulateSubmit('  hello  ', onSend)
    expect(onSend).toHaveBeenCalledOnce()
    expect(onSend).toHaveBeenCalledWith('hello')
  })
})
