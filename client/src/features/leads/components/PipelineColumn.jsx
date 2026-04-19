const accentClasses = {
  slate: 'bg-slate-100 text-slate-700',
  amber: 'bg-amber-100 text-amber-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  teal: 'bg-teal-100 text-teal-800',
  rose: 'bg-rose-100 text-rose-800',
}

function PipelineColumn({ column, renderLead, mobile = false }) {
  const count = column.leads.length

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] shadow-sm ${
        mobile ? '' : 'h-full'
      }`}
    >
      <div className="border-b border-[color:var(--border)] bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {column.label}
            </p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {column.caption}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              accentClasses[column.accent]
            }`}
          >
            {count}
          </span>
        </div>
      </div>

      <div className={`flex-1 ${mobile ? '' : 'min-h-0 overflow-y-auto'} bg-[color:var(--panel-soft)] p-3`}>
        {count ? (
          <div className="space-y-3">
            {column.leads.map((lead) => renderLead(lead))}
          </div>
        ) : (
          <div className="flex h-full min-h-[180px] items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
            <div className="max-w-xs">
              <p className="text-sm font-semibold text-slate-900">
                No leads in {column.label.toLowerCase()}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                This stage is empty right now. New leads or stage movement will
                appear here later.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default PipelineColumn

