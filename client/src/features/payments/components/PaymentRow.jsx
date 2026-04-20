const statusClasses = {
  Paid: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Pending: 'border-amber-200 bg-amber-50 text-amber-800',
  Partial: 'border-sky-200 bg-sky-50 text-sky-800',
  Expired: 'border-slate-200 bg-slate-100 text-slate-700',
  Cancelled: 'border-rose-200 bg-rose-50 text-rose-700',
}

function PaymentRow({ record, mobile = false }) {
  if (mobile) {
    return (
      <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {record.customerName}
            </p>
            <p className="mt-1 text-sm text-slate-500">{record.businessName}</p>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
              statusClasses[record.status]
            }`}
          >
            {record.status}
          </span>
        </div>

        <dl className="mt-4 space-y-3 text-sm leading-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Amount
            </p>
            <p className="mt-1 font-medium text-slate-900">{record.amount}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Context
            </p>
            <p className="mt-1 text-slate-700">{record.source}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Link URL
            </p>
            <a
              href={record.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-all text-slate-700 underline decoration-slate-300 underline-offset-4"
            >
              {record.linkUrl}
            </a>
          </div>
        </dl>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
          {record.createdAt}
        </p>
      </article>
    )
  }

  return (
    <div className="grid grid-cols-[170px_180px_130px_140px_160px] items-start gap-4 border-b border-slate-200 px-5 py-4 last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-slate-950">
          {record.customerName}
        </p>
        <p className="mt-1 text-sm text-slate-500">{record.businessName}</p>
      </div>

      <div>
        <p className="text-sm text-slate-700">{record.source}</p>
        <a
          href={record.linkUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block break-all text-xs text-slate-500 underline decoration-slate-300 underline-offset-4"
        >
          {record.linkUrl}
        </a>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-950">{record.amount}</p>
      </div>

      <div>
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
            statusClasses[record.status]
          }`}
        >
          {record.status}
        </span>
      </div>

      <div>
        <p className="text-sm text-slate-500">{record.createdAt}</p>
      </div>
    </div>
  )
}

export default PaymentRow
