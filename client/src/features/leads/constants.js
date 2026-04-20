export const LEADS_STAGE_COLUMNS = [
  {
    id: 'new',
    stage: 'New',
    label: 'New',
    caption: 'Fresh leads waiting for first response',
    accent: 'slate',
  },
  {
    id: 'contacted',
    stage: 'Contacted',
    label: 'Contacted',
    caption: 'First reply sent, waiting on next step',
    accent: 'amber',
  },
  {
    id: 'qualified',
    stage: 'Qualified',
    label: 'Qualified',
    caption: 'Active buying intent and clear requirement',
    accent: 'emerald',
  },
  {
    id: 'won',
    stage: 'Won',
    label: 'Won',
    caption: 'Confirmed business and payment follow-through',
    accent: 'teal',
  },
  {
    id: 'lost',
    stage: 'Lost',
    label: 'Lost',
    caption: 'No current opportunity or closed out',
    accent: 'rose',
  },
]

export const LEAD_STAGE_OPTIONS = LEADS_STAGE_COLUMNS.map((column) => ({
  label: column.label,
  value: column.stage,
}))

export function buildLeadsPipelineColumns(leads) {
  return LEADS_STAGE_COLUMNS.map((column) => ({
    ...column,
    leads: leads.filter((lead) => lead.stage === column.stage),
  }))
}

export function buildLeadsPipelineStats(leads) {
  return {
    totalLeads: leads.filter(
      (lead) => lead.stage !== 'Won' && lead.stage !== 'Lost',
    ).length,
    qualifiedLeads: leads.filter((lead) => lead.stage === 'Qualified').length,
    wonLeads: leads.filter((lead) => lead.stage === 'Won').length,
  }
}
