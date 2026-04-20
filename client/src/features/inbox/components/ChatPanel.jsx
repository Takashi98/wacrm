const messageBubbleClasses = {
  contact:
    'mr-auto rounded-[22px] rounded-bl-md bg-white text-slate-900 shadow-sm',
  user: 'ml-auto rounded-[22px] rounded-br-md bg-emerald-700 text-white shadow-sm',
  system: 'mx-auto rounded-full bg-slate-900 text-white shadow-sm',
}

function ChatPanel({
  conversation,
  status = 'idle',
  errorMessage = '',
  onBack,
  onOpenLead,
  onSelectFirstConversation,
}) {
  if (status === 'loading' && !conversation) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white">
        <div className="border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Active chat
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            Message timeline
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center bg-[color:var(--panel-soft)] p-6">
          <div className="max-w-md rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Loading conversation
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              WACRM is loading messages and contact context for this chat.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error' && !conversation) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white">
        <div className="border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Active chat
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            Message timeline
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center bg-[color:var(--panel-soft)] p-6">
          <div className="max-w-md rounded-[28px] border border-rose-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Could not open conversation
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              {errorMessage || 'The selected conversation could not be loaded.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white">
        <div className="border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Active chat
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            Message timeline
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center bg-[color:var(--panel-soft)] p-6">
          <div className="max-w-lg rounded-[30px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              No chat selected
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Pick a conversation to open the inbox workspace
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              The center panel is reserved for the active timeline, keeping the
              chat as the main focus while lead details stay visible on the
              right.
            </p>
            <button
              type="button"
              onClick={onSelectFirstConversation}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Open latest conversation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={onBack}
              className="mt-0.5 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 lg:hidden"
            >
              Back
            </button>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-semibold text-white">
              {conversation.businessName
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-950">
                {conversation.businessName}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {conversation.phone} | {conversation.city}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                  {conversation.stage}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                  Owner: {conversation.assignee}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLead}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm lg:hidden"
          >
            Lead info
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[color:var(--panel-soft)] px-4 py-5 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-5 flex justify-center">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
              {conversation.timelineLabel || 'Latest activity'}
            </span>
          </div>

          {conversation.messages.length ? (
            <div className="space-y-3">
              {conversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] px-4 py-3 text-sm leading-6 ${
                    messageBubbleClasses[message.sender]
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`mt-2 text-xs ${
                      message.sender === 'user'
                        ? 'text-emerald-100'
                        : message.sender === 'system'
                          ? 'text-slate-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                No messages yet
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                This lead record exists, but the message timeline has not
                started. Use this state later for first-contact or campaign-led
                leads.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-[color:var(--panel-soft)] px-3 py-3">
          <input
            readOnly
            value=""
            placeholder="Reply composer will connect in a later task"
            className="flex-1 bg-transparent text-sm text-slate-500 outline-none"
          />
          <button
            type="button"
            disabled
            className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Message composer is visual only in this shell.
        </p>
      </div>
    </div>
  )
}

export default ChatPanel
