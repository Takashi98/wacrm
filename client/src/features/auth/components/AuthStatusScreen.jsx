function AuthStatusScreen({
  eyebrow = 'WACRM',
  title = 'Checking your access',
  description = 'Please wait while we verify your session.',
}) {
  return (
    <div className="min-h-screen px-2 py-2 sm:px-3 sm:py-3 lg:px-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[720px] items-center justify-center rounded-[30px] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="w-full max-w-md rounded-[28px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthStatusScreen
