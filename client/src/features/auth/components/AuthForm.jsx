function AuthForm({
  fields,
  values,
  onChange,
  onSubmit,
  submitLabel,
  helperText,
  errorMessage,
  isSubmitting,
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            {field.label}
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-[color:var(--panel-strong)] px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
            name={field.name}
            type={field.type}
            value={values[field.name]}
            onChange={onChange}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            disabled={isSubmitting}
            required
          />
          {field.hint ? (
            <span className="mt-2 block text-xs text-[color:var(--muted)]">
              {field.hint}
            </span>
          ) : null}
        </label>
      ))}

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {helperText ? (
        <p className="text-xs leading-5 text-[color:var(--muted)]">{helperText}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? 'Please wait...' : submitLabel}
      </button>
    </form>
  )
}

export default AuthForm
