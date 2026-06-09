'use client'

import { CreateProjectSchema } from '@docbrain/validators'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@docbrain/ui'
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
    <Card className="border-white/60 bg-white/85">
      <CardHeader>
        <CardTitle>Create a documentation project</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="project-name">
              Name
            </label>
            <Input
              id="project-name"
              placeholder="Acme docs"
              value={formState.name}
              onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="project-root-url">
              Root URL
            </label>
            <Input
              id="project-root-url"
              placeholder="https://docs.example.com"
              value={formState.rootUrl}
              onChange={(event) => setFormState((current) => ({ ...current, rootUrl: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="project-description">
              Description
            </label>
            <Textarea
              id="project-description"
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
          <Button disabled={createProject.isPending} type="submit">
            {createProject.isPending ? 'Creating project...' : 'Create project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
