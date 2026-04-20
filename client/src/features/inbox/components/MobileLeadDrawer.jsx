import LeadSidebar from './LeadSidebar'

function MobileLeadDrawer({
  conversation,
  status,
  errorMessage,
  onCreateLead,
  isCreateLeadDisabled,
  onCreatePaymentLink,
  isCreatePaymentLinkDisabled,
  open,
  onClose,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close lead drawer"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35"
      />

      <div className="absolute inset-x-0 bottom-0 top-20 overflow-hidden rounded-t-[28px] border border-[color:var(--border)] bg-[color:var(--panel)] shadow-[0_-20px_60px_rgba(15,23,42,0.16)]">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Lead details
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Contact context without leaving chat
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600"
          >
            X
          </button>
        </div>

        <LeadSidebar
          conversation={conversation}
          status={status}
          errorMessage={errorMessage}
          onCreateLead={onCreateLead}
          isCreateLeadDisabled={isCreateLeadDisabled}
          onCreatePaymentLink={onCreatePaymentLink}
          isCreatePaymentLinkDisabled={isCreatePaymentLinkDisabled}
        />
      </div>
    </div>
  )
}

export default MobileLeadDrawer
