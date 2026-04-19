import { Link, NavLink, Outlet } from 'react-router-dom'

function AppShell() {
  return (
    <div className="min-h-screen px-2 py-2 sm:px-3 sm:py-3 lg:px-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1600px] flex-col overflow-hidden rounded-[30px] border border-[color:var(--border)] bg-[color:var(--panel)] shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <header className="border-b border-[color:var(--border)] bg-[color:var(--panel-strong)]/90 px-4 py-3 sm:px-5 lg:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <Link to="/inbox" className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-semibold tracking-[0.14em] text-white">
                  WA
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    WACRM
                  </p>
                  <p className="text-lg font-semibold text-slate-950">
                    WhatsApp-first CRM
                  </p>
                </div>
              </Link>

              <nav className="flex flex-wrap items-center gap-2">
                {[
                  { label: 'Inbox', to: '/inbox' },
                  { label: 'Leads', to: '/leads' },
                  { label: 'Automations', to: '/automations' },
                  { label: 'Payments', to: '/payments' },
                  { label: 'Analytics', to: '/analytics' },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                MVP shell
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                Mock data only
              </span>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 overflow-hidden px-2 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
