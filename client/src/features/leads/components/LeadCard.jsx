function LeadCard({ lead }) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {lead.leadName}
          </p>
          <p className="mt-1 truncate text-sm text-slate-500">
            {lead.businessName}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
          {lead.tag}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-slate-500">Source</dt>
          <dd className="text-right font-medium text-slate-900">{lead.source}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-slate-500">Owner</dt>
          <dd className="text-right font-medium text-slate-900">{lead.owner}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-slate-500">Value</dt>
          <dd className="text-right font-medium text-slate-900">
            {lead.estimatedValue}
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-2xl bg-[color:var(--panel-soft)] px-3 py-3 text-sm leading-6 text-slate-600">
        {lead.note}
      </div>
    </article>
  )
}

export default LeadCard

