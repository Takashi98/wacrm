function PaymentsSidebar({
  insights,
  onCreatePaymentLink,
  isCreateDisabled = false,
  hasLeads = true,
}) {
  return (
    <>
      <section className="rounded-[24px] border border-[color:var(--border)] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Create
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-950">
          Create a payment link
        </h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          Keep payment requests clear and easy to follow for small business
          operators and customers.
        </p>
        <button
          type="button"
          onClick={onCreatePaymentLink}
          disabled={isCreateDisabled}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Create payment link
        </button>
        {!hasLeads ? (
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            Create a lead first so a payment link can be attached to real lead
            context.
          </p>
        ) : null}
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
            No saved drafts
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Draft links or follow-up reminders can appear here later without
            crowding the main payment records list.
          </p>
        </div>
      </section>
    </>
  )
}

export default PaymentsSidebar
