function LeadsHeader({ stats }) {
  const items = [
    {
      label: 'Open',
      value: stats.totalLeads,
    },
    {
      label: 'Qualified',
      value: stats.qualifiedLeads,
    },
    {
      label: 'Won',
      value: stats.wonLeads,
    },
  ]

  return (
    <section className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-3 shadow-sm sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Leads
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Pipeline workspace
          </h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Workspace-scoped pipeline data from your backend
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-full border border-slate-200 bg-white px-3 py-2"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LeadsHeader
