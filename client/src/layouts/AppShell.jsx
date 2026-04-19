import { Link, Outlet } from 'react-router-dom'

function AppShell() {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--panel)] shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <header className="border-b border-[color:var(--border)] px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-800 text-sm font-semibold tracking-[0.14em] text-white">
                WA
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                  WACRM
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  MVP foundation
                </p>
              </div>
            </Link>

            <div className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
              React, Tailwind, Router, Express
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell

