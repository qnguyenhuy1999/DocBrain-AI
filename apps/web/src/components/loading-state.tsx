import { Card, CardContent, Spinner } from '@docbrain/ui'

export function LoadingState({
  title = 'Loading',
  description = 'Fetching the latest data.',
}: {
  title?: string
  description?: string
}) {
  return (
    <Card className="border-white/60 bg-white/85">
      <CardContent className="flex items-center gap-3 p-6">
        <Spinner className="h-5 w-5 text-amber-600" />
        <div>
          <p className="font-medium text-slate-950">{title}</p>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
