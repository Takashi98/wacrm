import PaymentRow from './PaymentRow'

function PaymentTable({ records }) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-[color:var(--panel-strong)]">
      <div className="border-b border-[color:var(--border)] bg-white px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Records
            </p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              Payment links list
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Simple payment summaries that operators can trust and scan fast.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {records.length}
          </span>
        </div>
      </div>

      {records.length ? (
        <>
          <div className="hidden border-b border-slate-200 bg-[color:var(--panel-soft)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 xl:grid xl:grid-cols-[170px_180px_130px_140px_160px] xl:gap-4">
            <span>Customer</span>
            <span>Context</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Updated</span>
          </div>

          <div className="hidden min-h-0 flex-1 overflow-y-auto xl:block">
            {records.map((record) => (
              <PaymentRow key={record.id} record={record} />
            ))}
          </div>

          <div className="space-y-3 bg-[color:var(--panel-soft)] p-3 xl:hidden">
            {records.map((record) => (
              <PaymentRow key={record.id} record={record} mobile />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-[color:var(--panel-soft)] p-6">
          <div className="max-w-md rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              No payment links yet
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Payment links created for workspace leads will appear here with
              simple statuses and follow-up context.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default PaymentTable
