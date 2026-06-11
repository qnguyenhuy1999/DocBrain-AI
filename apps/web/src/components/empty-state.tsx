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
    <div
      className="rounded-xl border border-dashed p-8 text-sm"
      style={{
        background: 'color-mix(in srgb, var(--muted) 40%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <p className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>{title}</p>
      <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
