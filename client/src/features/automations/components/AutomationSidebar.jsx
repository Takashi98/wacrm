function AutomationSidebar({
  templates,
  onCreateAutomation,
  isCreateDisabled = false,
}) {
  return (
    <>
      <section className="rounded-[24px] border border-[color:var(--border)] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Create
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-950">
          Start a simple automation
        </h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          Keep the first version focused on clear follow-ups and owner alerts.
        </p>
        <button
          type="button"
          onClick={onCreateAutomation}
          disabled={isCreateDisabled}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Create automation
        </button>
      </section>

      <section className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Suggested flows
        </p>
        <div className="mt-4 space-y-3">
          {templates.map((template) => (
            <article
              key={template.id}
              className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-950">
                {template.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {template.description}
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
            No drafts saved
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Draft rules and paused ideas can appear here later without crowding
            the main operations list.
          </p>
        </div>
      </section>
    </>
  )
}

export default AutomationSidebar
