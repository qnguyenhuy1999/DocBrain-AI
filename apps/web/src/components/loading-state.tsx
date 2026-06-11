export function LoadingState({
  title = 'Loading',
  description = 'Fetching the latest data.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div
      className="rounded-xl border px-4 py-4 flex items-center gap-3 text-sm"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <SpinnerIcon />
      <div>
        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{title}</p>
        <p className="mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
      </div>
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin shrink-0"
      style={{ color: 'var(--secondary)' }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
}
