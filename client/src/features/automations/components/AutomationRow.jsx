const statusClasses = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  inactive: 'border-slate-200 bg-slate-100 text-slate-700',
}

function AutomationRow({
  rule,
  mobile = false,
  onToggleStatus,
  isUpdatingStatus = false,
}) {
  const nextStatus = rule.status === 'active' ? 'inactive' : 'active'
  const toggleLabel =
    rule.status === 'active' ? 'Pause rule' : 'Activate rule'

  if (mobile) {
    return (
      <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {rule.name}
            </p>
            <p className="mt-1 text-sm text-slate-500">{rule.scope}</p>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
              statusClasses[rule.status]
            }`}
          >
            {rule.status}
          </span>
        </div>

        <div className="mt-4 space-y-3 text-sm leading-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Trigger
            </p>
            <p className="mt-1 text-slate-700">{rule.trigger}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Action
            </p>
            <p className="mt-1 text-slate-700">{rule.action}</p>
          </div>
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
          {rule.lastEvent}
        </p>

        <button
          type="button"
          onClick={() => onToggleStatus(rule.id, nextStatus)}
          disabled={isUpdatingStatus}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {isUpdatingStatus ? 'Saving...' : toggleLabel}
        </button>
      </article>
    )
  }

  return (
    <div className="grid grid-cols-[180px_150px_minmax(220px,1fr)_minmax(220px,1fr)_140px] items-start gap-4 border-b border-slate-200 px-5 py-4 last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-slate-950">{rule.name}</p>
        <p className="mt-1 text-sm text-slate-500">{rule.scope}</p>
      </div>

      <div>
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
            statusClasses[rule.status]
          }`}
        >
          {rule.status}
        </span>
        <button
          type="button"
          onClick={() => onToggleStatus(rule.id, nextStatus)}
          disabled={isUpdatingStatus}
          className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {isUpdatingStatus ? 'Saving...' : toggleLabel}
        </button>
      </div>

      <div>
        <p className="text-sm text-slate-700">{rule.trigger}</p>
      </div>

      <div>
        <p className="text-sm text-slate-700">{rule.action}</p>
      </div>

      <div>
        <p className="text-sm text-slate-500">{rule.lastEvent}</p>
      </div>
    </div>
  )
}

export default AutomationRow
