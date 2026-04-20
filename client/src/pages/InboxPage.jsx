import { useEffect, useRef, useState } from 'react'
import {
  createLeadFromConversationRequest,
  getConversationDetailRequest,
  getInboxConversationsRequest,
} from '../features/inbox/api'
import ChatPanel from '../features/inbox/components/ChatPanel'
import ConversationList from '../features/inbox/components/ConversationList'
import InboxHeader from '../features/inbox/components/InboxHeader'
import LeadSidebar from '../features/inbox/components/LeadSidebar'
import MobileLeadDrawer from '../features/inbox/components/MobileLeadDrawer'
import CreateLeadModal from '../features/leads/components/CreateLeadModal'
import CreatePaymentLinkModal from '../features/payments/components/CreatePaymentLinkModal'
import { createPaymentLinkRequest } from '../features/payments/api'
import {
  buildInboxStats,
  normalizeConversationDetail,
  normalizeConversationSummary,
} from '../features/inbox/normalize'

async function fetchInboxConversationSummaries() {
  const data = await getInboxConversationsRequest()

  return data.conversations.map(normalizeConversationSummary)
}

async function fetchInboxConversationDetail(conversationId) {
  const data = await getConversationDetailRequest(conversationId)

  return normalizeConversationDetail(data.conversation)
}

function buildCreateLeadInitialValues(conversation) {
  if (!conversation) {
    return {
      name: '',
      businessName: '',
      source: '',
      value: '',
      notes: '',
      tags: '',
    }
  }

  return {
    name: conversation.contact.name || conversation.contactName || '',
    businessName:
      conversation.contact.businessName || conversation.businessName || '',
    source: conversation.contact.source || conversation.source || 'Inbox',
    value: '',
    notes: conversation.preview
      ? `Inbox context: ${conversation.preview}`
      : '',
    tags: '',
  }
}

function buildCreatePaymentLinkInitialValues(conversation) {
  if (!conversation?.hasLinkedLead) {
    return {
      leadId: '',
      amount: '',
      note: '',
    }
  }

  return {
    leadId: conversation.lead.id,
    amount:
      conversation.lead.estimatedValue !== 'TBD'
        ? String(conversation.lead.estimatedValue.replace('Rs ', '').replaceAll(',', ''))
        : '',
    note: conversation.preview
      ? `Payment follow-up from inbox: ${conversation.preview}`
      : '',
  }
}

function InboxPage() {
  const hasLoadedInboxRef = useRef(false)
  const [conversations, setConversations] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [interactionErrorMessage, setInteractionErrorMessage] = useState('')
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [activeConversation, setActiveConversation] = useState(null)
  const [activeConversationStatus, setActiveConversationStatus] = useState('idle')
  const [activeConversationErrorMessage, setActiveConversationErrorMessage] =
    useState('')
  const [isLeadDrawerOpen, setIsLeadDrawerOpen] = useState(false)
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false)
  const [createLeadModalKey, setCreateLeadModalKey] = useState(0)
  const [isCreatingLead, setIsCreatingLead] = useState(false)
  const [createLeadErrorMessage, setCreateLeadErrorMessage] = useState('')
  const [isCreatePaymentLinkOpen, setIsCreatePaymentLinkOpen] = useState(false)
  const [createPaymentLinkModalKey, setCreatePaymentLinkModalKey] = useState(0)
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState(false)
  const [createPaymentLinkErrorMessage, setCreatePaymentLinkErrorMessage] =
    useState('')

  useEffect(() => {
    if (hasLoadedInboxRef.current) {
      return
    }

    hasLoadedInboxRef.current = true

    async function loadConversations() {
      try {
        const nextConversations = await fetchInboxConversationSummaries()

        setConversations(nextConversations)
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

        const nextConversation = await fetchInboxConversationDetail(
          activeConversationId,
        )

        if (isCancelled) {
          return
        }

        setActiveConversation(nextConversation)
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
    setCreateLeadErrorMessage('')
    setCreatePaymentLinkErrorMessage('')
    setInteractionErrorMessage('')
    setIsCreateLeadOpen(false)
    setIsCreatePaymentLinkOpen(false)
    setActiveConversationId(conversationId)
    setIsLeadDrawerOpen(false)
  }

  function handleBackToList() {
    setActiveConversation(null)
    setActiveConversationStatus('idle')
    setActiveConversationErrorMessage('')
    setCreateLeadErrorMessage('')
    setCreatePaymentLinkErrorMessage('')
    setInteractionErrorMessage('')
    setIsCreateLeadOpen(false)
    setIsCreatePaymentLinkOpen(false)
    setActiveConversationId(null)
    setIsLeadDrawerOpen(false)
  }

  function handleOpenCreateLead() {
    if (!activeConversation || activeConversation.hasLinkedLead) {
      return
    }

    setCreateLeadErrorMessage('')
    setInteractionErrorMessage('')
    setCreateLeadModalKey((currentValue) => currentValue + 1)
    setIsCreateLeadOpen(true)
  }

  function handleOpenCreatePaymentLink() {
    if (!activeConversation?.hasLinkedLead) {
      return
    }

    setCreatePaymentLinkErrorMessage('')
    setInteractionErrorMessage('')
    setCreatePaymentLinkModalKey((currentValue) => currentValue + 1)
    setIsCreatePaymentLinkOpen(true)
  }

  async function handleCreateLead(payload) {
    if (!activeConversationId) {
      return
    }

    setCreateLeadErrorMessage('')
    setInteractionErrorMessage('')
    setIsCreatingLead(true)

    try {
      await createLeadFromConversationRequest(activeConversationId, payload)
      setIsCreateLeadOpen(false)

      try {
        const [nextConversations, nextConversation] = await Promise.all([
          fetchInboxConversationSummaries(),
          fetchInboxConversationDetail(activeConversationId),
        ])

        setConversations(nextConversations)
        setActiveConversation(nextConversation)
        setStatus('success')
        setErrorMessage('')
        setActiveConversationStatus('ready')
        setActiveConversationErrorMessage('')
      } catch {
        setInteractionErrorMessage(
          'Lead was created, but the inbox view could not be refreshed automatically. Refresh the page once.',
        )
      }
    } catch (error) {
      setCreateLeadErrorMessage(error.message)
    } finally {
      setIsCreatingLead(false)
    }
  }

  async function handleCreatePaymentLink(payload) {
    if (!activeConversation?.hasLinkedLead) {
      return
    }

    setCreatePaymentLinkErrorMessage('')
    setInteractionErrorMessage('')
    setIsCreatingPaymentLink(true)

    try {
      await createPaymentLinkRequest(payload)
      setIsCreatePaymentLinkOpen(false)

      try {
        const nextConversation = await fetchInboxConversationDetail(
          activeConversationId,
        )

        setActiveConversation(nextConversation)
        setActiveConversationStatus('ready')
        setActiveConversationErrorMessage('')
      } catch {
        setInteractionErrorMessage(
          'Payment link was created, but the inbox detail could not be refreshed automatically. Refresh the page once.',
        )
      }
    } catch (error) {
      setCreatePaymentLinkErrorMessage(error.message)
    } finally {
      setIsCreatingPaymentLink(false)
    }
  }

  const inboxStats = buildInboxStats(conversations)

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
        <InboxHeader stats={inboxStats} />

        <section className="min-h-0 flex-1">
          {interactionErrorMessage && status === 'success' ? (
            <div className="mb-3 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
              {interactionErrorMessage}
            </div>
          ) : null}

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
                    onCreateLead={handleOpenCreateLead}
                    isCreateLeadDisabled={isCreatingLead}
                    onCreatePaymentLink={handleOpenCreatePaymentLink}
                    isCreatePaymentLinkDisabled={isCreatingPaymentLink}
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
        onCreateLead={handleOpenCreateLead}
        isCreateLeadDisabled={isCreatingLead}
        onCreatePaymentLink={handleOpenCreatePaymentLink}
        isCreatePaymentLinkDisabled={isCreatingPaymentLink}
        open={Boolean(activeConversation) && isLeadDrawerOpen}
        onClose={() => setIsLeadDrawerOpen(false)}
      />

      <CreateLeadModal
        key={createLeadModalKey}
        open={isCreateLeadOpen}
        onClose={() => setIsCreateLeadOpen(false)}
        onSubmit={handleCreateLead}
        isSubmitting={isCreatingLead}
        errorMessage={createLeadErrorMessage}
        initialValues={buildCreateLeadInitialValues(activeConversation)}
        description="Convert this conversation into a pipeline lead without leaving the inbox."
      />

      <CreatePaymentLinkModal
        key={createPaymentLinkModalKey}
        open={isCreatePaymentLinkOpen}
        onClose={() => setIsCreatePaymentLinkOpen(false)}
        onSubmit={handleCreatePaymentLink}
        isSubmitting={isCreatingPaymentLink}
        errorMessage={createPaymentLinkErrorMessage}
        leadOptions={
          activeConversation?.hasLinkedLead
            ? [
                {
                  value: activeConversation.lead.id,
                  label: activeConversation.lead.businessName
                    ? `${activeConversation.lead.contactName} - ${activeConversation.lead.businessName}`
                    : activeConversation.lead.contactName,
                  source: activeConversation.lead.source,
                  defaultAmount:
                    activeConversation.lead.estimatedValue !== 'TBD'
                      ? Number(
                          activeConversation.lead.estimatedValue
                            .replace('Rs ', '')
                            .replaceAll(',', ''),
                        )
                      : 0,
                },
              ]
            : []
        }
        initialValues={buildCreatePaymentLinkInitialValues(activeConversation)}
        description="Create a payment link directly from this lead context without leaving the inbox."
        isLeadLocked
      />
    </>
  )
}

export default InboxPage
