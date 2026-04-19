function PageSection({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-sm backdrop-blur sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default PageSection

