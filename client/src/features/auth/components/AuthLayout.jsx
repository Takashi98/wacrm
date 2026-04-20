import { Link } from 'react-router-dom'

const featureHighlights = [
  {
    title: 'Inbox-first workflow',
    description:
      'Keep WhatsApp conversations, lead context, and follow-up actions in one place.',
  },
  {
    title: 'Simple pipeline control',
    description:
      'Move leads forward without introducing enterprise CRM complexity too early.',
  },
  {
    title: 'Operational visibility',
    description:
      'Track automations, payments, and analytics from the same protected workspace.',
  },
]

function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="min-h-screen px-2 py-2 sm:px-3 sm:py-3 lg:px-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1320px] overflow-hidden rounded-[30px] border border-[color:var(--border)] bg-[color:var(--panel)] shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
        <div className="grid flex-1 lg:grid-cols-[minmax(0,1.15fr)_460px]">
          <section className="hidden border-r border-[color:var(--border)] bg-[color:var(--panel-strong)] px-8 py-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link to="/login" className="inline-flex items-center gap-3">
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

              <div className="mt-10 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Secure access
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                  A focused workspace for SMB teams running sales on WhatsApp.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-7 text-[color:var(--muted)]">
                  Start with a clean auth foundation now, then keep building the
                  product without reworking access control later.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {featureHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-[color:var(--border)] bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
            <div className="w-full max-w-[420px]">
              <div className="mb-5 lg:hidden">
                <Link to="/login" className="inline-flex items-center gap-3">
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
              </div>

              <div className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-sm sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {eyebrow}
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  {description}
                </p>

                <div className="mt-6">{children}</div>

                {footer ? (
                  <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-[color:var(--muted)]">
                    {footer}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
