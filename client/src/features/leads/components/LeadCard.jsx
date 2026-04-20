import { useState } from 'react'

function formatDateTimeLocalValue(dateInput) {
  if (!dateInput) {
    return ''
  }

  const value = new Date(dateInput)

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  const timezoneOffsetMs = value.getTimezoneOffset() * 60 * 1000

  return new Date(value.getTime() - timezoneOffsetMs).toISOString().slice(0, 16)
}

function buildNextHourDateTimeLocalValue() {
  const value = new Date()

  value.setHours(value.getHours() + 1, 0, 0, 0)

  return formatDateTimeLocalValue(value)
}

function LeadCard({
  lead,
  stageOptions = [],
  onStageChange,
  isUpdatingStage = false,
  onCompleteFollowUp,
  onSnoozeFollowUp,
  isUpdatingFollowUp = false,
}) {
  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false)
  const [snoozeValue, setSnoozeValue] = useState('')
  const [followUpErrorMessage, setFollowUpErrorMessage] = useState('')
  const cardToneClasses =
    lead.followUpStatus === 'overdue'
      ? 'border-rose-200 ring-1 ring-rose-100'
      : lead.followUpStatus === 'due_now'
        ? 'border-amber-200 ring-1 ring-amber-100'
        : 'border-slate-200'
  const followUpToneClasses =
    lead.followUpStatus === 'overdue'
      ? 'border-rose-200 bg-rose-50 text-rose-950'
      : 'border-amber-200 bg-amber-50 text-amber-950'
  const followUpLabelClasses =
    lead.followUpStatus === 'overdue' ? 'text-rose-700' : 'text-amber-700'

  async function handleCompleteFollowUp() {
    if (!onCompleteFollowUp) {
      return
    }

    setFollowUpErrorMessage('')

    try {
      await onCompleteFollowUp(lead.id)
      setIsSnoozeOpen(false)
    } catch (error) {
      setFollowUpErrorMessage(error.message)
    }
  }

  function handleOpenSnooze() {
    setFollowUpErrorMessage('')
    setSnoozeValue(
      formatDateTimeLocalValue(lead.followUpDueAt) ||
        buildNextHourDateTimeLocalValue(),
    )
    setIsSnoozeOpen(true)
  }

  function handleCancelSnooze() {
    if (isUpdatingFollowUp) {
      return
    }

    setFollowUpErrorMessage('')
    setIsSnoozeOpen(false)
  }

  async function handleSaveSnooze() {
    if (!onSnoozeFollowUp) {
      return
    }

    if (!snoozeValue) {
      setFollowUpErrorMessage('Select a new follow-up time')
      return
    }

    const nextFollowUpDueAt = new Date(snoozeValue)

    if (Number.isNaN(nextFollowUpDueAt.getTime())) {
      setFollowUpErrorMessage('Enter a valid follow-up time')
      return
    }

    setFollowUpErrorMessage('')

    try {
      await onSnoozeFollowUp(lead.id, nextFollowUpDueAt.toISOString())
      setIsSnoozeOpen(false)
    } catch (error) {
      setFollowUpErrorMessage(error.message)
    }
  }

  return (
    <article
      className={`rounded-[22px] border bg-white p-4 shadow-sm ${cardToneClasses}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {lead.leadName}
          </p>
          <p className="mt-1 truncate text-sm text-slate-500">
            {lead.businessName}
          </p>
        </div>
        {lead.tag ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
            {lead.tag}
          </span>
        ) : null}
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

      {lead.followUpDueText ? (
        <div
          className={`mt-4 rounded-2xl border px-3 py-3 ${followUpToneClasses}`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${followUpLabelClasses}`}
          >
            Follow-up due
          </p>
          <p className="mt-1 text-sm font-medium">
            {lead.followUpDueText}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCompleteFollowUp}
              disabled={isUpdatingFollowUp}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {isUpdatingFollowUp ? 'Saving...' : 'Done'}
            </button>
            <button
              type="button"
              onClick={handleOpenSnooze}
              disabled={isUpdatingFollowUp}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              Snooze
            </button>
          </div>

          {isSnoozeOpen ? (
            <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-3">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  New follow-up time
                </span>
                <input
                  type="datetime-local"
                  value={snoozeValue}
                  onChange={(event) => setSnoozeValue(event.target.value)}
                  disabled={isUpdatingFollowUp}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </label>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSaveSnooze}
                  disabled={isUpdatingFollowUp}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isUpdatingFollowUp ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelSnooze}
                  disabled={isUpdatingFollowUp}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {followUpErrorMessage ? (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {followUpErrorMessage}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl bg-[color:var(--panel-soft)] px-3 py-3 text-sm leading-6 text-slate-600">
        {lead.note}
      </div>

      {onStageChange ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-[color:var(--panel-strong)] px-3 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Stage
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                Move the lead forward in the pipeline.
              </p>
            </div>
            <select
              value={lead.stage}
              onChange={(event) => onStageChange(lead.id, event.target.value)}
              disabled={isUpdatingStage}
              className="min-w-[8.5rem] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {stageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </article>
  )
}

export default LeadCard
