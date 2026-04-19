function AnalyticsMetricCard({ metric }) {
  return (
    <article className="rounded-[22px] border border-[color:var(--border)] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {metric.label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {metric.value}
      </p>
      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
        {metric.helper}
      </p>
    </article>
  )
}

export default AnalyticsMetricCard

