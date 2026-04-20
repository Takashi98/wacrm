import { useEffect, useRef, useState } from 'react'
import { getLeadsRequest } from '../features/leads/api'
import LeadCard from '../features/leads/components/LeadCard'
import LeadsHeader from '../features/leads/components/LeadsHeader'
import PipelineColumn from '../features/leads/components/PipelineColumn'
import {
  buildLeadsPipelineColumns,
  buildLeadsPipelineStats,
} from '../features/leads/constants'

function formatLeadValue(value) {
  return `Rs ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value || 0)}`
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
  }
}

function LeadsPage() {
  const hasLoadedLeadsRef = useRef(false)
  const [leads, setLeads] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (hasLoadedLeadsRef.current) {
      return
    }

    hasLoadedLeadsRef.current = true

    async function loadLeads() {
      try {
        const data = await getLeadsRequest()

        setLeads(data.leads.map(normalizeLead))
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

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <LeadsHeader stats={leadsPipelineStats} />

      <section className="min-h-0 flex-1">
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
                {errorMessage || 'The leads API did not return data for this workspace.'}
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
                    renderLead={(lead) => <LeadCard key={lead.id} lead={lead} />}
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
                  renderLead={(lead) => <LeadCard key={lead.id} lead={lead} />}
                />
              ))}
            </div>
          </>
        ) : null}
      </section>
    </div>
  )
}

export default LeadsPage
