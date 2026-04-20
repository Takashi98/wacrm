function LeadsHeader({
  stats,
  onCreateLead,
  isCreateDisabled = false,
  followUpCounts = {
    all: 0,
    dueNow: 0,
    overdue: 0,
  },
  leadViewOptions = [],
  activeLeadView = 'pipeline',
  onLeadViewChange,
}) {
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
  const viewCountMap = {
    pipeline: stats.totalLeads,
    all: followUpCounts.all,
    due_now: followUpCounts.dueNow,
    overdue: followUpCounts.overdue,
  }

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

          {leadViewOptions.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {leadViewOptions.map((option) => {
                const isActive = option.id === activeLeadView
                const count = option.id === 'pipeline' ? null : viewCountMap[option.id]

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onLeadViewChange?.(option.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{option.label}</span>
                    {count !== null ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count || 0}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <button
            type="button"
            onClick={onCreateLead}
            disabled={isCreateDisabled}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Create lead
          </button>

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
      </div>
    </section>
  )
}

export default LeadsHeader
