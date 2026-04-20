import AutomationRow from './AutomationRow'

function AutomationTable({
  rules,
  onToggleStatus,
  updatingAutomationId = '',
}) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-[color:var(--panel-strong)]">
      <div className="border-b border-[color:var(--border)] bg-white px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Rules
            </p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              Live automation rules
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Review simple workflow rules and pause or activate them as needed.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {rules.length}
          </span>
        </div>
      </div>

      {rules.length ? (
        <>
          <div className="hidden border-b border-slate-200 bg-[color:var(--panel-soft)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 xl:grid xl:grid-cols-[180px_150px_minmax(220px,1fr)_minmax(220px,1fr)_140px] xl:gap-4">
            <span>Rule</span>
            <span>Status</span>
            <span>Trigger</span>
            <span>Action</span>
            <span>Last event</span>
          </div>

          <div className="hidden min-h-0 flex-1 overflow-y-auto xl:block">
            {rules.map((rule) => (
              <AutomationRow
                key={rule.id}
                rule={rule}
                onToggleStatus={onToggleStatus}
                isUpdatingStatus={updatingAutomationId === rule.id}
              />
            ))}
          </div>

          <div className="space-y-3 bg-[color:var(--panel-soft)] p-3 xl:hidden">
            {rules.map((rule) => (
              <AutomationRow
                key={rule.id}
                rule={rule}
                mobile
                onToggleStatus={onToggleStatus}
                isUpdatingStatus={updatingAutomationId === rule.id}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-[color:var(--panel-soft)] p-6">
          <div className="max-w-md rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              No automation rules yet
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Create your first simple follow-up or owner notification rule for
              this workspace.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default AutomationTable
