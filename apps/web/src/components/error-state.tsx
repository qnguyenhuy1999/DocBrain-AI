export function ErrorState({
  title = 'Request failed',
  message,
}: {
  title?: string
  message: string
}) {
  return (
    <div
      className="rounded-xl border px-4 py-3.5 text-sm"
      style={{
        background: 'color-mix(in srgb, var(--destructive) 8%, transparent)',
        borderColor: 'color-mix(in srgb, var(--destructive) 25%, transparent)',
        color: 'var(--foreground)',
      }}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{message}</p>
    </div>
  )
}
