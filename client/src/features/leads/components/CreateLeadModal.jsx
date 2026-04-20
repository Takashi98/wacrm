import { useState } from 'react'

const INITIAL_FORM_VALUES = {
  name: '',
  businessName: '',
  source: '',
  value: '',
  notes: '',
  tags: '',
}

function buildFormValues(initialValues = {}) {
  return {
    name: initialValues.name || '',
    businessName: initialValues.businessName || '',
    source: initialValues.source || '',
    value:
      initialValues.value === 0 || initialValues.value === ''
        ? ''
        : initialValues.value
          ? String(initialValues.value)
          : '',
    notes: initialValues.notes || '',
    tags: Array.isArray(initialValues.tags)
      ? initialValues.tags.join(', ')
      : initialValues.tags || '',
  }
}

function CreateLeadModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
  initialValues = INITIAL_FORM_VALUES,
  description = 'Add a new lead into your pipeline without leaving the board.',
}) {
  const [values, setValues] = useState(() => buildFormValues(initialValues))

  if (!open) {
    return null
  }

  function handleChange(event) {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      name: values.name.trim(),
      businessName: values.businessName.trim(),
      source: values.source.trim(),
      value: values.value === '' ? 0 : Number(values.value),
      notes: values.notes.trim(),
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
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
              Create lead
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
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-1">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Lead name
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Aarti Sharma"
                  disabled={isSubmitting}
                  required
                />
              </label>

              <label className="block sm:col-span-1">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Business name
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                  name="businessName"
                  type="text"
                  value={values.businessName}
                  onChange={handleChange}
                  placeholder="Aarti Collection"
                  disabled={isSubmitting}
                />
              </label>

              <label className="block sm:col-span-1">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Source
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                  name="source"
                  type="text"
                  value={values.source}
                  onChange={handleChange}
                  placeholder="Instagram DM"
                  disabled={isSubmitting}
                />
              </label>

              <label className="block sm:col-span-1">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Value
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                  name="value"
                  type="number"
                  min="0"
                  step="1"
                  value={values.value}
                  onChange={handleChange}
                  placeholder="18000"
                  disabled={isSubmitting}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Tags
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                  name="tags"
                  type="text"
                  value={values.tags}
                  onChange={handleChange}
                  placeholder="Fresh inquiry, Wholesale"
                  disabled={isSubmitting}
                />
                <span className="mt-2 block text-xs text-[color:var(--muted)]">
                  Separate tags with commas.
                </span>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </span>
                <textarea
                  className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400"
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  placeholder="Asked for wholesale pricing and a callback after 5 PM."
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
                {isSubmitting ? 'Creating lead...' : 'Create lead'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateLeadModal
