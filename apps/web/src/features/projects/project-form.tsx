'use client'

import { CreateProjectSchema } from '@docbrain/validators'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ErrorState } from '@/components/error-state'
import { useCreateProject } from './api'

type FormState = {
  name: string
  rootUrl: string
  description: string
}

const initialState: FormState = {
  name: '',
  rootUrl: '',
  description: '',
}

const inputClass = 'flex h-9 w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2'
const inputStyle = { background: 'var(--background)', borderColor: 'var(--input)', color: 'var(--foreground)' }

export function ProjectForm() {
  const router = useRouter()
  const createProject = useCreateProject()
  const [formState, setFormState] = useState<FormState>(initialState)
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsed = CreateProjectSchema.safeParse({
      name: formState.name,
      rootUrl: formState.rootUrl,
      description: formState.description || undefined,
    })

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Invalid project input')
      return
    }

    setValidationError(null)
    const project = await createProject.mutateAsync(parsed.data)
    router.push(`/projects/${project.id}`)
  }

  return (
    <div className="rounded-lg border p-6 max-w-xl" style={{ background: 'var(--card)' }}>
      <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Create a project</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Set a root URL and the crawler will index every page under it.</p>
      <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }} htmlFor="project-name">
            Name
          </label>
          <input
            id="project-name"
            className={inputClass}
            style={inputStyle}
            placeholder="Acme docs"
            value={formState.name}
            onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }} htmlFor="project-root-url">
            Root URL
          </label>
          <input
            id="project-root-url"
            className={inputClass}
            style={inputStyle}
            placeholder="https://docs.example.com"
            value={formState.rootUrl}
            onChange={(event) => setFormState((current) => ({ ...current, rootUrl: event.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }} htmlFor="project-description">
            Description <span className="font-normal" style={{ color: 'var(--muted-foreground)' }}>(optional)</span>
          </label>
          <textarea
            id="project-description"
            rows={3}
            className="flex w-full rounded-md border px-3 py-2 text-sm resize-none transition-colors focus:outline-none focus:ring-2"
            style={inputStyle}
            placeholder="What documentation should this project crawl and answer from?"
            value={formState.description}
            onChange={(event) =>
              setFormState((current) => ({ ...current, description: event.target.value }))
            }
          />
        </div>
        {validationError ? <ErrorState title="Validation failed" message={validationError} /> : null}
        {createProject.error ? (
          <ErrorState message={createProject.error.message} title="Project creation failed" />
        ) : null}
        <button
          type="submit"
          disabled={createProject.isPending}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 transition-colors disabled:opacity-50"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {createProject.isPending ? 'Creating…' : 'Create project'}
        </button>
      </form>
    </div>
  )
}
