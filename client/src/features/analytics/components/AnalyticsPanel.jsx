function AnalyticsPanel({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default AnalyticsPanel

