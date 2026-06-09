import { Alert, AlertDescription, AlertTitle } from '@docbrain/ui'

export function ErrorState({
  title = 'Request failed',
  message,
}: {
  title?: string
  message: string
}) {
  return (
    <Alert className="border-rose-200 bg-rose-50/90 text-rose-950">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-rose-800">{message}</AlertDescription>
    </Alert>
  )
}
