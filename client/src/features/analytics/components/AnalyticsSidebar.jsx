function AnalyticsSidebar({ insights }) {
  return (
    <>
      <section className="rounded-[24px] border border-[color:var(--border)] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Snapshot
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-950">
          This week at a glance
        </h2>
        <div className="mt-4 space-y-3">
          {[
            ['Best day', 'Friday'],
            ['Top source', 'Instagram'],
            ['Collected', 'Rs 1.88L'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-2xl bg-[color:var(--panel-soft)] px-4 py-3"
            >
              <span className="text-sm text-slate-600">{label}</span>
              <span className="text-sm font-semibold text-slate-950">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Helpful context
        </p>
        <div className="mt-4 space-y-3">
          {insights.map((insight) => (
            <article
              key={insight.id}
              className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-950">
                {insight.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {insight.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Empty state
        </p>
        <div className="mt-4 rounded-[20px] border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No scheduled reports
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Scheduled summaries or exports can appear here later without
            changing the business dashboard shell.
          </p>
        </div>
      </section>
    </>
  )
}

export default AnalyticsSidebar

