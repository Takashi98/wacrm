import { useEffect, useState } from 'react'
import {
  completeLeadFollowUpRequest,
  createLeadRequest,
  getLeadFollowUpsRequest,
  getLeadsRequest,
  snoozeLeadFollowUpRequest,
  updateLeadStageRequest,
} from '../features/leads/api'
import CreateLeadModal from '../features/leads/components/CreateLeadModal'
import LeadCard from '../features/leads/components/LeadCard'
import LeadsHeader from '../features/leads/components/LeadsHeader'
import PipelineColumn from '../features/leads/components/PipelineColumn'
import {
  LEAD_VIEW_OPTIONS,
  LEAD_STAGE_OPTIONS,
  buildLeadsPipelineColumns,
  buildLeadsPipelineStats,
} from '../features/leads/constants'

function formatLeadValue(value) {
  return `Rs ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value || 0)}`
}

function formatClock(value) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatFollowUpDue(dateInput) {
  if (!dateInput) {
    return ''
  }

  const value = new Date(dateInput)

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  const now = new Date()

  if (Math.abs(now.getTime() - value.getTime()) < 5 * 60 * 1000) {
    return 'Due now'
  }

  if (isSameDay(value, now)) {
    return `Due today, ${formatClock(value)}`
  }

  return `Due ${new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)}`
}

function getStartOfToday(now) {
  const startOfToday = new Date(now)

  startOfToday.setHours(0, 0, 0, 0)

  return startOfToday
}

function getFollowUpStatus(dateInput) {
  if (!dateInput) {
    return ''
  }

  const value = new Date(dateInput)

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  const now = new Date()
  const startOfToday = getStartOfToday(now)

  if (value < startOfToday) {
    return 'overdue'
  }

  if (value <= now) {
    return 'due_now'
  }

  return ''
}

function normalizeLead(lead) {
  const followUpStatus = getFollowUpStatus(lead.followUpDueAt)

  return {
    id: lead.id,
    leadName: lead.name,
    businessName: lead.businessName || 'Business name pending',
    source: lead.source || 'Not set',
    owner: 'Unassigned',
    estimatedValue: formatLeadValue(lead.value),
    note: lead.notes || 'No notes added for this lead yet.',
    stage: lead.stage,
    tag: lead.tags?.[0] || '',
    followUpDueAt: lead.followUpDueAt || null,
    lastFollowUpCompletedAt: lead.lastFollowUpCompletedAt || null,
    followUpStatus,
    followUpDueText: formatFollowUpDue(lead.followUpDueAt),
  }
}

function isLeadVisibleInView(lead, view) {
  if (view === 'pipeline') {
    return true
  }

  if (view === 'all') {
    return Boolean(lead.followUpDueAt)
  }

  if (view === 'due_now') {
    return lead.followUpStatus === 'due_now'
  }

  if (view === 'overdue') {
    return lead.followUpStatus === 'overdue'
  }

  return true
}

function sortLeadsForView(leads, view) {
  if (view === 'pipeline') {
    return leads
  }

  return [...leads].sort((a, b) => {
    const aTime = a.followUpDueAt ? new Date(a.followUpDueAt).getTime() : 0
    const bTime = b.followUpDueAt ? new Date(b.followUpDueAt).getTime() : 0

    return aTime - bTime
  })
}

function applyLeadToCurrentView(currentLeads, nextLead, activeView) {
  const isVisible = isLeadVisibleInView(nextLead, activeView)

  const nextLeads = currentLeads
    .map((lead) => (lead.id === nextLead.id ? nextLead : lead))
    .filter((lead) => (lead.id === nextLead.id ? isVisible : true))

  return sortLeadsForView(nextLeads, activeView)
}

function applyFollowUpCountUpdate(previousCounts, previousLead, nextLead) {
  const previousState = {
    all: previousLead?.followUpDueAt ? 1 : 0,
    dueNow: previousLead?.followUpStatus === 'due_now' ? 1 : 0,
    overdue: previousLead?.followUpStatus === 'overdue' ? 1 : 0,
  }
  const nextState = {
    all: nextLead?.followUpDueAt ? 1 : 0,
    dueNow: nextLead?.followUpStatus === 'due_now' ? 1 : 0,
    overdue: nextLead?.followUpStatus === 'overdue' ? 1 : 0,
  }

  return {
    all: Math.max(0, previousCounts.all + nextState.all - previousState.all),
    dueNow: Math.max(
      0,
      previousCounts.dueNow + nextState.dueNow - previousState.dueNow,
    ),
    overdue: Math.max(
      0,
      previousCounts.overdue + nextState.overdue - previousState.overdue,
    ),
  }
}

async function fetchLeadsViewData(view) {
  if (view === 'pipeline') {
    const [leadsData, followUpsData] = await Promise.all([
      getLeadsRequest(),
      getLeadFollowUpsRequest('all'),
    ])

    return {
      leads: leadsData.leads.map(normalizeLead),
      followUpCounts: followUpsData.counts,
    }
  }

  const followUpsData = await getLeadFollowUpsRequest(view)

  return {
    leads: followUpsData.leads.map(normalizeLead),
    followUpCounts: followUpsData.counts,
  }
}

function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [interactionErrorMessage, setInteractionErrorMessage] = useState('')
  const [followUpCounts, setFollowUpCounts] = useState({
    all: 0,
    dueNow: 0,
    overdue: 0,
  })
  const [activeLeadView, setActiveLeadView] = useState('pipeline')
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false)
  const [createLeadModalKey, setCreateLeadModalKey] = useState(0)
  const [isCreatingLead, setIsCreatingLead] = useState(false)
  const [createLeadErrorMessage, setCreateLeadErrorMessage] = useState('')
  const [updatingLeadId, setUpdatingLeadId] = useState('')
  const [updatingFollowUpLeadId, setUpdatingFollowUpLeadId] = useState('')

  useEffect(() => {
    async function loadLeads() {
      try {
        setStatus('loading')
        const nextData = await fetchLeadsViewData(activeLeadView)

        setLeads(nextData.leads)
        setFollowUpCounts(nextData.followUpCounts)
        setErrorMessage('')
        setStatus('success')
      } catch (error) {
        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadLeads()
  }, [activeLeadView])

  const leadsPipelineColumns = buildLeadsPipelineColumns(leads)
  const leadsPipelineStats = buildLeadsPipelineStats(leads)

  async function refreshLeadsBoard() {
    const nextData = await fetchLeadsViewData(activeLeadView)

    setLeads(nextData.leads)
    setFollowUpCounts(nextData.followUpCounts)
    setInteractionErrorMessage('')
    setStatus('success')
  }

  async function handleCreateLead(payload) {
    setCreateLeadErrorMessage('')
    setInteractionErrorMessage('')
    setIsCreatingLead(true)

    try {
      await createLeadRequest(payload)
      await refreshLeadsBoard()
      setIsCreateLeadOpen(false)
    } catch (error) {
      setCreateLeadErrorMessage(error.message)
    } finally {
      setIsCreatingLead(false)
    }
  }

  async function handleStageChange(leadId, stage) {
    const currentLead = leads.find((lead) => lead.id === leadId)

    if (!currentLead || currentLead.stage === stage) {
      return
    }

    setUpdatingLeadId(leadId)
    setInteractionErrorMessage('')

    try {
      await updateLeadStageRequest(leadId, stage)
      await refreshLeadsBoard()
    } catch (error) {
      setInteractionErrorMessage(error.message)
    } finally {
      setUpdatingLeadId('')
    }
  }

  async function handleCompleteFollowUp(leadId) {
    const currentLead = leads.find((lead) => lead.id === leadId)

    if (!currentLead) {
      return
    }

    setUpdatingFollowUpLeadId(leadId)

    try {
      const response = await completeLeadFollowUpRequest(leadId)
      const nextLead = normalizeLead(response.lead)

      setLeads((currentLeads) =>
        applyLeadToCurrentView(currentLeads, nextLead, activeLeadView),
      )
      setFollowUpCounts((currentCounts) =>
        applyFollowUpCountUpdate(currentCounts, currentLead, nextLead),
      )
    } finally {
      setUpdatingFollowUpLeadId('')
    }
  }

  async function handleSnoozeFollowUp(leadId, followUpDueAt) {
    const currentLead = leads.find((lead) => lead.id === leadId)

    if (!currentLead) {
      return
    }

    setUpdatingFollowUpLeadId(leadId)

    try {
      const response = await snoozeLeadFollowUpRequest(leadId, followUpDueAt)
      const nextLead = normalizeLead(response.lead)

      setLeads((currentLeads) =>
        applyLeadToCurrentView(currentLeads, nextLead, activeLeadView),
      )
      setFollowUpCounts((currentCounts) =>
        applyFollowUpCountUpdate(currentCounts, currentLead, nextLead),
      )
    } finally {
      setUpdatingFollowUpLeadId('')
    }
  }

  function handleOpenCreateLead() {
    setCreateLeadErrorMessage('')
    setCreateLeadModalKey((currentValue) => currentValue + 1)
    setIsCreateLeadOpen(true)
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
        <LeadsHeader
          stats={leadsPipelineStats}
          followUpCounts={followUpCounts}
          leadViewOptions={LEAD_VIEW_OPTIONS}
          activeLeadView={activeLeadView}
          onLeadViewChange={setActiveLeadView}
          onCreateLead={handleOpenCreateLead}
          isCreateDisabled={status === 'loading' || isCreatingLead}
        />

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
                  Loading leads
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  WACRM is loading your workspace pipeline from the backend.
                </p>
              </div>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-[24px] border border-rose-200 bg-white px-6 py-10 text-center shadow-sm">
              <div className="max-w-md">
                <p className="text-sm font-semibold text-slate-900">
                  Could not load leads
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {errorMessage ||
                    'The leads API did not return data for this workspace.'}
                </p>
              </div>
            </div>
          ) : null}

          {status === 'success' ? (
            <>
              <div className="hidden h-full min-h-0 lg:block">
                <div className="grid h-full min-h-0 grid-cols-5 gap-3">
                  {leadsPipelineColumns.map((column) => (
                    <PipelineColumn
                      key={column.id}
                      column={column}
                      renderLead={(lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          stageOptions={LEAD_STAGE_OPTIONS}
                          onStageChange={handleStageChange}
                          isUpdatingStage={updatingLeadId === lead.id}
                          onCompleteFollowUp={handleCompleteFollowUp}
                          onSnoozeFollowUp={handleSnoozeFollowUp}
                          isUpdatingFollowUp={updatingFollowUpLeadId === lead.id}
                        />
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:hidden">
                {leadsPipelineColumns.map((column) => (
                  <PipelineColumn
                    key={column.id}
                    column={column}
                    mobile
                    renderLead={(lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        stageOptions={LEAD_STAGE_OPTIONS}
                        onStageChange={handleStageChange}
                        isUpdatingStage={updatingLeadId === lead.id}
                        onCompleteFollowUp={handleCompleteFollowUp}
                        onSnoozeFollowUp={handleSnoozeFollowUp}
                        isUpdatingFollowUp={updatingFollowUpLeadId === lead.id}
                      />
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </section>
      </div>

      <CreateLeadModal
        key={createLeadModalKey}
        open={isCreateLeadOpen}
        onClose={() => setIsCreateLeadOpen(false)}
        onSubmit={handleCreateLead}
        isSubmitting={isCreatingLead}
        errorMessage={createLeadErrorMessage}
      />
    </>
  )
}

export default LeadsPage
