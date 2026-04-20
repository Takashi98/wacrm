import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-md rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          Route not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">404</h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          This route is not part of the current WACRM workspace.
        </p>
        <Link
          to="/inbox"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Back to inbox
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
