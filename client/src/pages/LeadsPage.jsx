import { useEffect, useRef, useState } from 'react'
import {
  createLeadRequest,
  getLeadsRequest,
  updateLeadStageRequest,
} from '../features/leads/api'
import CreateLeadModal from '../features/leads/components/CreateLeadModal'
import LeadCard from '../features/leads/components/LeadCard'
import LeadsHeader from '../features/leads/components/LeadsHeader'
import PipelineColumn from '../features/leads/components/PipelineColumn'
import {
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

function normalizeLead(lead) {
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
    followUpDueText: formatFollowUpDue(lead.followUpDueAt),
  }
}

async function fetchLeadsBoardData() {
  const data = await getLeadsRequest()

  return data.leads.map(normalizeLead)
}

function LeadsPage() {
  const hasLoadedLeadsRef = useRef(false)
  const [leads, setLeads] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [interactionErrorMessage, setInteractionErrorMessage] = useState('')
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false)
  const [createLeadModalKey, setCreateLeadModalKey] = useState(0)
  const [isCreatingLead, setIsCreatingLead] = useState(false)
  const [createLeadErrorMessage, setCreateLeadErrorMessage] = useState('')
  const [updatingLeadId, setUpdatingLeadId] = useState('')

  useEffect(() => {
    if (hasLoadedLeadsRef.current) {
      return
    }

    hasLoadedLeadsRef.current = true

    async function loadLeads() {
      try {
        const nextLeads = await fetchLeadsBoardData()

        setLeads(nextLeads)
        setErrorMessage('')
        setStatus('success')
      } catch (error) {
        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadLeads()
  }, [])

  const leadsPipelineColumns = buildLeadsPipelineColumns(leads)
  const leadsPipelineStats = buildLeadsPipelineStats(leads)

  async function refreshLeadsBoard() {
    const nextLeads = await fetchLeadsBoardData()

    setLeads(nextLeads)
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
