import { useState } from 'react'

const INITIAL_FORM_VALUES = {
  leadId: '',
  amount: '',
  note: '',
}

function buildFormValues(initialValues = {}) {
  return {
    leadId: initialValues.leadId || '',
    amount:
      initialValues.amount === 0 || initialValues.amount === ''
        ? ''
        : initialValues.amount
          ? String(initialValues.amount)
          : '',
    note: initialValues.note || '',
  }
}

function CreatePaymentLinkModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
  leadOptions = [],
  initialValues = INITIAL_FORM_VALUES,
  description = 'Create a simple payment link for an existing lead.',
  isLeadLocked = false,
}) {
  const [values, setValues] = useState(() => buildFormValues(initialValues))

  if (!open) {
    return null
  }

  const selectedLead = leadOptions.find((lead) => lead.value === values.leadId)

  function handleChange(event) {
    const { name, value } = event.target

    setValues((currentValues) => {
      if (name === 'leadId') {
        const nextLead = leadOptions.find((lead) => lead.value === value)

        return {
          ...currentValues,
          leadId: value,
          amount:
            currentValues.amount === '' && nextLead?.defaultAmount
              ? String(nextLead.defaultAmount)
              : currentValues.amount,
        }
      }

      return {
        ...currentValues,
        [name]: value,
      }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      leadId: values.leadId,
      amount: Number(values.amount),
      note: values.note.trim(),
    })
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/35"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-x-0 bottom-0 top-16 overflow-hidden rounded-t-[28px] border border-[color:var(--border)] bg-[color:var(--panel)] shadow-[0_-20px_60px_rgba(15,23,42,0.16)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Create payment link
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            X
          </button>
        </div>

        <form
          className="flex h-full max-h-[calc(100vh-8rem)] flex-col sm:max-h-[80vh]"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Lead
                </span>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-400"
                  name="leadId"
                  value={values.leadId}
                  onChange={handleChange}
                  disabled={isSubmitting || isLeadLocked}
                  required
                >
                  <option value="">Select a lead</option>
                  {leadOptions.map((lead) => (
                    <option key={lead.value} value={lead.value}>
                      {lead.label}
                    </option>
                  ))}
                </select>
              </label>

              {selectedLead ? (
                <div className="rounded-2xl border border-slate-200 bg-[color:var(--panel-soft)] px-4 py-3 text-sm text-slate-700">
                  Lead source: {selectedLead.source}
                </div>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                  name="amount"
                  type="number"
                  min="1"
                  step="1"
                  value={values.amount}
                  onChange={handleChange}
                  placeholder="18000"
                  disabled={isSubmitting}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Note
                </span>
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                  name="note"
                  value={values.note}
                  onChange={handleChange}
                  placeholder="Advance payment for onboarding and setup."
                  disabled={isSubmitting}
                />
              </label>
            </div>

            {errorMessage ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}
          </div>

          <div className="border-t border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? 'Creating link...' : 'Create payment link'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePaymentLinkModal
