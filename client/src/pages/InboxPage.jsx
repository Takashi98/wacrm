import { useEffect, useRef, useState } from 'react'
import {
  getConversationDetailRequest,
  getInboxConversationsRequest,
} from '../features/inbox/api'
import ChatPanel from '../features/inbox/components/ChatPanel'
import ConversationList from '../features/inbox/components/ConversationList'
import InboxHeader from '../features/inbox/components/InboxHeader'
import LeadSidebar from '../features/inbox/components/LeadSidebar'
import MobileLeadDrawer from '../features/inbox/components/MobileLeadDrawer'
import {
  buildInboxStats,
  normalizeConversationDetail,
  normalizeConversationSummary,
} from '../features/inbox/normalize'

function InboxPage() {
  const hasLoadedInboxRef = useRef(false)
  const [conversations, setConversations] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [activeConversation, setActiveConversation] = useState(null)
  const [activeConversationStatus, setActiveConversationStatus] = useState('idle')
  const [activeConversationErrorMessage, setActiveConversationErrorMessage] =
    useState('')
  const [isLeadDrawerOpen, setIsLeadDrawerOpen] = useState(false)

  useEffect(() => {
    if (hasLoadedInboxRef.current) {
      return
    }

    hasLoadedInboxRef.current = true

    async function loadConversations() {
      try {
        const data = await getInboxConversationsRequest()

        setConversations(data.conversations.map(normalizeConversationSummary))
        setErrorMessage('')
        setStatus('success')
      } catch (error) {
        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadConversations()
  }, [])

  useEffect(() => {
    if (!activeConversationId) {
      return
    }

    let isCancelled = false

    async function loadConversationDetail() {
      try {
        setActiveConversationStatus('loading')
        setActiveConversationErrorMessage('')

        const data = await getConversationDetailRequest(activeConversationId)

        if (isCancelled) {
          return
        }

        setActiveConversation(normalizeConversationDetail(data.conversation))
        setActiveConversationStatus('ready')
      } catch (error) {
        if (isCancelled) {
          return
        }

        setActiveConversation(null)
        setActiveConversationStatus('error')
        setActiveConversationErrorMessage(error.message)
      }
    }

    loadConversationDetail()

    return () => {
      isCancelled = true
    }
  }, [activeConversationId])

  function handleSelectConversation(conversationId) {
    setActiveConversation(null)
    setActiveConversationStatus('loading')
    setActiveConversationErrorMessage('')
    setActiveConversationId(conversationId)
    setIsLeadDrawerOpen(false)
  }

  function handleBackToList() {
    setActiveConversation(null)
    setActiveConversationStatus('idle')
    setActiveConversationErrorMessage('')
    setActiveConversationId(null)
    setIsLeadDrawerOpen(false)
  }

  const inboxStats = buildInboxStats(conversations)

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
        <InboxHeader stats={inboxStats} />

        <section className="min-h-0 flex-1">
          {status === 'loading' ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-[24px] border border-[color:var(--border)] bg-white px-6 py-10 text-center shadow-sm">
              <div className="max-w-md">
                <p className="text-sm font-semibold text-slate-900">
                  Loading inbox
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  WACRM is loading workspace conversations from the backend.
                </p>
              </div>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-[24px] border border-rose-200 bg-white px-6 py-10 text-center shadow-sm">
              <div className="max-w-md">
                <p className="text-sm font-semibold text-slate-900">
                  Could not load inbox
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {errorMessage ||
                    'The inbox API did not return conversations for this workspace.'}
                </p>
              </div>
            </div>
          ) : null}

          {status === 'success' ? (
            <>
              <div className="hidden h-full min-h-0 lg:grid lg:grid-cols-[320px_minmax(0,1fr)_340px] lg:gap-3 xl:grid-cols-[340px_minmax(0,1fr)_360px]">
                <aside className="min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] shadow-sm">
                  <ConversationList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelect={handleSelectConversation}
                  />
                </aside>

                <section className="min-h-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_56px_rgba(15,23,42,0.1)]">
                  <ChatPanel
                    conversation={activeConversation}
                    status={activeConversationStatus}
                    errorMessage={activeConversationErrorMessage}
                    onBack={handleBackToList}
                    onOpenLead={() => setIsLeadDrawerOpen(true)}
                    onSelectFirstConversation={() => {
                      if (conversations[0]) {
                        handleSelectConversation(conversations[0].id)
                      }
                    }}
                  />
                </section>

                <aside className="min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] shadow-sm">
                  <LeadSidebar
                    conversation={activeConversation}
                    status={activeConversationStatus}
                    errorMessage={activeConversationErrorMessage}
                  />
                </aside>
              </div>

              <div className="h-full lg:hidden">
                {!activeConversationId ? (
                  <div className="h-full overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-white shadow-sm">
                    <ConversationList
                      conversations={conversations}
                      activeConversationId={activeConversationId}
                      onSelect={handleSelectConversation}
                    />
                  </div>
                ) : (
                  <div className="h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                    <ChatPanel
                      conversation={activeConversation}
                      status={activeConversationStatus}
                      errorMessage={activeConversationErrorMessage}
                      onBack={handleBackToList}
                      onOpenLead={() => setIsLeadDrawerOpen(true)}
                      onSelectFirstConversation={() => {
                        if (conversations[0]) {
                          handleSelectConversation(conversations[0].id)
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          ) : null}
        </section>
      </div>

      <MobileLeadDrawer
        conversation={activeConversation}
        status={activeConversationStatus}
        errorMessage={activeConversationErrorMessage}
        open={Boolean(activeConversation) && isLeadDrawerOpen}
        onClose={() => setIsLeadDrawerOpen(false)}
      />
    </>
  )
}

export default InboxPage
