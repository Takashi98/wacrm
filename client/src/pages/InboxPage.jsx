import { useState } from 'react'
import ChatPanel from '../features/inbox/components/ChatPanel'
import ConversationList from '../features/inbox/components/ConversationList'
import InboxHeader from '../features/inbox/components/InboxHeader'
import LeadSidebar from '../features/inbox/components/LeadSidebar'
import MobileLeadDrawer from '../features/inbox/components/MobileLeadDrawer'
import { inboxConversations, inboxStats } from '../features/inbox/mockData'

function InboxPage() {
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [isLeadDrawerOpen, setIsLeadDrawerOpen] = useState(false)

  const activeConversation =
    inboxConversations.find(
      (conversation) => conversation.id === activeConversationId,
    ) || null

  function handleSelectConversation(conversationId) {
    setActiveConversationId(conversationId)
    setIsLeadDrawerOpen(false)
  }

  function handleBackToList() {
    setActiveConversationId(null)
    setIsLeadDrawerOpen(false)
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
        <InboxHeader stats={inboxStats} />

        <section className="min-h-0 flex-1">
          <div className="hidden h-full min-h-0 lg:grid lg:grid-cols-[320px_minmax(0,1fr)_340px] lg:gap-3 xl:grid-cols-[340px_minmax(0,1fr)_360px]">
            <aside className="min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] shadow-sm">
              <ConversationList
                conversations={inboxConversations}
                activeConversationId={activeConversationId}
                onSelect={handleSelectConversation}
              />
            </aside>

            <section className="min-h-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_56px_rgba(15,23,42,0.1)]">
              <ChatPanel
                conversation={activeConversation}
                onBack={handleBackToList}
                onOpenLead={() => setIsLeadDrawerOpen(true)}
                onSelectFirstConversation={() =>
                  handleSelectConversation(inboxConversations[0].id)
                }
              />
            </section>

            <aside className="min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel-strong)] shadow-sm">
              <LeadSidebar conversation={activeConversation} />
            </aside>
          </div>

          <div className="h-full lg:hidden">
            {!activeConversation ? (
              <div className="h-full overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-white shadow-sm">
                <ConversationList
                  conversations={inboxConversations}
                  activeConversationId={activeConversationId}
                  onSelect={handleSelectConversation}
                />
              </div>
            ) : (
              <div className="h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <ChatPanel
                  conversation={activeConversation}
                  onBack={handleBackToList}
                  onOpenLead={() => setIsLeadDrawerOpen(true)}
                  onSelectFirstConversation={() =>
                    handleSelectConversation(inboxConversations[0].id)
                  }
                />
              </div>
            )}
          </div>
        </section>
      </div>

      <MobileLeadDrawer
        conversation={activeConversation}
        open={Boolean(activeConversation) && isLeadDrawerOpen}
        onClose={() => setIsLeadDrawerOpen(false)}
      />
    </>
  )
}

export default InboxPage
