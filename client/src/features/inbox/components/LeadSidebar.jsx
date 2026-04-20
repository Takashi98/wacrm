function Section({ title, children }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function EmptyInline({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-[color:var(--panel-soft)] px-4 py-4 text-sm leading-6 text-[color:var(--muted)]">
      {text}
    </div>
  )
}

function LeadSidebar({
  conversation,
  status = 'idle',
  errorMessage = '',
  onCreateLead,
  isCreateLeadDisabled = false,
  onCreatePaymentLink,
  isCreatePaymentLinkDisabled = false,
}) {
  if (status === 'loading' && !conversation) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[color:var(--panel-strong)]">
        <div className="border-b border-[color:var(--border)] bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Lead details
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            Contact context
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center p-5">
          <div className="max-w-xs text-center">
            <p className="text-sm font-semibold text-slate-900">
              Loading contact details
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              WACRM is loading contact and lead context for the selected chat.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error' && !conversation) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[color:var(--panel-strong)]">
        <div className="border-b border-[color:var(--border)] bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Lead details
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            Contact context
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center p-5">
          <div className="max-w-xs text-center">
            <p className="text-sm font-semibold text-slate-900">
              Could not load contact context
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              {errorMessage || 'The selected conversation details are not available.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[color:var(--panel-strong)]">
        <div className="border-b border-[color:var(--border)] bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Lead details
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            Contact context
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center p-5">
          <div className="max-w-xs text-center">
            <p className="text-sm font-semibold text-slate-900">
              Lead details will appear here
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Open a conversation to view contact details, stage, notes, and
              tags without leaving the inbox.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { lead } = conversation

  if (!conversation.hasLinkedLead) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[color:var(--panel-strong)]">
        <div className="border-b border-[color:var(--border)] bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Lead details
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            Contact context
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-sm font-semibold">
                  {conversation.contactName
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold">
                    {conversation.contactName}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {conversation.businessName}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-medium text-amber-200">
                      Contact only
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200">
                      Owner: {conversation.assignee}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Section title="Create lead">
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                This conversation is not in the pipeline yet. Create a lead to
                track stage, notes, and next steps from the inbox.
              </p>
              <button
                type="button"
                onClick={onCreateLead}
                disabled={isCreateLeadDisabled}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Create lead
              </button>
            </Section>

            <Section title="Contact summary">
              <dl className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {conversation.phone}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {conversation.contact.email || 'Not added'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">Source</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {conversation.contact.source || 'Not set'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">City</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {conversation.city}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">Last activity</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {lead.lastActivity}
                  </dd>
                </div>
              </dl>
            </Section>

            <Section title="Latest message">
              {conversation.preview ? (
                <div className="rounded-2xl bg-[color:var(--panel-soft)] px-4 py-4 text-sm leading-6 text-slate-700">
                  {conversation.preview}
                </div>
              ) : (
                <EmptyInline text="No message preview is available for this conversation yet." />
              )}
            </Section>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[color:var(--panel-strong)]">
      <div className="border-b border-[color:var(--border)] bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Lead details
        </p>
        <p className="mt-2 text-base font-semibold text-slate-950">
          CRM context
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-sm font-semibold">
                {lead.contactName
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">
                  {lead.contactName}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {lead.businessName}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-200">
                    {lead.stage}
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200">
                    Owner: {lead.owner}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Section title="Lead summary">
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Phone</dt>
                <dd className="text-right font-medium text-slate-900">
                  {lead.phone}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="text-right font-medium text-slate-900">
                  {lead.email}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Source</dt>
                <dd className="text-right font-medium text-slate-900">
                  {lead.source}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">City</dt>
                <dd className="text-right font-medium text-slate-900">
                  {lead.city}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Estimated value</dt>
                <dd className="text-right font-medium text-slate-900">
                  {lead.estimatedValue}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Payment</dt>
                <dd className="text-right font-medium text-slate-900">
                  {lead.paymentStatus}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Last activity</dt>
                <dd className="text-right font-medium text-slate-900">
                  {lead.lastActivity}
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="Tags">
            {lead.tags.length ? (
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[color:var(--panel-soft)] px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyInline text="No tags added yet. This space is ready for lead labels in a later task." />
            )}
          </Section>

          <Section title="Payment link">
            {lead.hasPaymentLink ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-slate-900">
                    {lead.paymentStatus}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-medium text-slate-900">
                    {lead.paymentAmount}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500">Updated</span>
                  <span className="text-right font-medium text-slate-900">
                    {lead.paymentUpdatedAt}
                  </span>
                </div>
                <div className="rounded-2xl bg-[color:var(--panel-soft)] px-4 py-4 text-sm text-slate-700">
                  {lead.paymentLinkUrl}
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm leading-6 text-[color:var(--muted)]">
                  No payment link has been created for this lead yet. Create one
                  from the inbox to keep the sales flow moving.
                </p>
                <button
                  type="button"
                  onClick={onCreatePaymentLink}
                  disabled={isCreatePaymentLinkDisabled}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Create payment link
                </button>
              </>
            )}
          </Section>

          <Section title="Recent notes">
            {lead.notes.length ? (
              <div className="space-y-3">
                {lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-2xl bg-[color:var(--panel-soft)] px-4 py-4"
                  >
                    <p className="text-sm leading-6 text-slate-700">
                      {note.text}
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      {note.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyInline text="No notes yet. Use this area later for lead context, reminders, and handoff details." />
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}

export default LeadSidebar
