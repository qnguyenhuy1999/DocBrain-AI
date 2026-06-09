import { Card, CardContent } from '@docbrain/ui'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <Card className="border-dashed border-slate-300 bg-white/70">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <div>
          <p className="text-lg font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}
