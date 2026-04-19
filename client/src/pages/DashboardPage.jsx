import PageSection from '../components/common/PageSection'

const foundationAreas = [
  {
    title: 'Frontend setup',
    items: [
      'React + Vite app kept in JavaScript only',
      'Tailwind wired into Vite for shared utility styling',
      'React Router ready for future dashboard and auth flows',
    ],
  },
  {
    title: 'Backend setup',
    items: [
      'Express app split into config, routes, controllers, and middleware',
      'Base health route available under a versioned API prefix',
      'Environment loading ready for local and deployed configuration',
    ],
  },
  {
    title: 'Next modules',
    items: [
      'Inbox',
      'Leads',
      'Automations',
      'Payments',
      'Analytics',
    ],
  },
]

function DashboardPage() {
  const appName = import.meta.env.VITE_APP_NAME || 'WACRM'
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'

  return (
    <div className="space-y-6">
      <PageSection
        eyebrow="Foundation"
        title={`${appName} is ready for feature work`}
        description="This screen is only a placeholder shell. It confirms the client routing, responsive layout, and styling baseline without introducing product features before the real modules are built."
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]">
          <div className="rounded-[24px] border border-slate-200 bg-[color:var(--panel-strong)] p-5">
            <p className="text-sm font-medium text-slate-500">Base API path</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {apiBaseUrl}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
              The frontend is prepared to talk to the backend through the Vite
              proxy in development. Product APIs can grow under this single
              versioned namespace.
            </p>
          </div>

          <div className="rounded-[24px] border border-teal-100 bg-teal-950 p-5 text-teal-50">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-200">
              Current route
            </p>
            <p className="mt-3 text-2xl font-semibold">/</p>
            <p className="mt-3 text-sm leading-6 text-teal-100/90">
              Add future routes for auth, inbox, leads, and settings inside the
              shared router without replacing this layout shell.
            </p>
          </div>
        </div>
      </PageSection>

      <section className="grid gap-4 lg:grid-cols-3">
        {foundationAreas.map((area) => (
          <PageSection
            key={area.title}
            eyebrow="Ready"
            title={area.title}
            description="Minimal structure only. No product workflows are implemented yet."
          >
            <ul className="space-y-3 text-sm leading-6 text-[color:var(--muted)]">
              {area.items.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </PageSection>
        ))}
      </section>
    </div>
  )
}

export default DashboardPage

