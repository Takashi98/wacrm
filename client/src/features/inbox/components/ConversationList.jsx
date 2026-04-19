const replyStateClasses = {
  'Awaiting reply': 'bg-amber-50 text-amber-800 border-amber-200',
  Unread: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'New lead': 'bg-sky-50 text-sky-800 border-sky-200',
  'Follow up today': 'bg-violet-50 text-violet-800 border-violet-200',
}

function ConversationList({ conversations, activeConversationId, onSelect }) {
  if (!conversations.length) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[color:var(--panel-soft)]">
        <div className="border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-4 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Conversations
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-xs text-center">
            <p className="text-sm font-semibold text-slate-900">
              No conversations yet
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              New chats will appear here once inbox sync is connected.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[color:var(--panel-soft)]">
      <div className="border-b border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Conversations
            </p>
            <p className="mt-2 text-base font-semibold text-slate-950">
              Inbox rail
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {conversations.length}
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-500 shadow-sm">
          Search and filters will come later
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-1">
          {conversations.map((conversation) => {
            const isActive = activeConversationId === conversation.id

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation.id)}
                className={`w-full rounded-[22px] border px-3 py-3 text-left transition ${
                  isActive
                    ? 'border-emerald-200 bg-white shadow-sm ring-1 ring-emerald-100'
                    : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-white/90'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold ${
                      isActive
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    {conversation.businessName
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {conversation.businessName}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {conversation.contactName}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-medium text-slate-500">
                          {conversation.lastMessageTime}
                        </p>
                        {conversation.unreadCount > 0 ? (
                          <span className="mt-2 inline-flex rounded-full bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white">
                            {conversation.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
                      {conversation.preview}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          replyStateClasses[conversation.replyState] ||
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {conversation.replyState}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {conversation.stage}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ConversationList
