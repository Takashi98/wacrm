export const leadsPipelineColumns = [
  {
    id: 'new',
    label: 'New',
    caption: 'Fresh leads waiting for first response',
    accent: 'slate',
    leads: [
      {
        id: 'lead-aarti',
        leadName: 'Aarti Sharma',
        businessName: 'Aarti Collection',
        source: 'Instagram DM',
        owner: 'Unassigned',
        estimatedValue: 'Rs 18,000',
        note: 'Asked for saree wholesale pricing',
        tag: 'Fresh inquiry',
      },
      {
        id: 'lead-deepak',
        leadName: 'Deepak Verma',
        businessName: 'Verma Electronics',
        source: 'Referral',
        owner: 'Riya',
        estimatedValue: 'Rs 42,000',
        note: 'Needs a callback after 5 PM',
        tag: 'Call today',
      },
    ],
  },
  {
    id: 'contacted',
    label: 'Contacted',
    caption: 'First reply sent, waiting on next step',
    accent: 'amber',
    leads: [
      {
        id: 'lead-farheen',
        leadName: 'Farheen Ali',
        businessName: 'Noor Boutique',
        source: 'WhatsApp referral',
        owner: 'Pooja',
        estimatedValue: 'Rs 12,400',
        note: 'Requested size availability and dispatch timeline',
        tag: 'Stock check',
      },
    ],
  },
  {
    id: 'qualified',
    label: 'Qualified',
    caption: 'Active buying intent and clear requirement',
    accent: 'emerald',
    leads: [
      {
        id: 'lead-anjali',
        leadName: 'Anjali Mehta',
        businessName: 'Anjali Saree House',
        source: 'Instagram DM',
        owner: 'Riya',
        estimatedValue: 'Rs 38,000',
        note: 'Bulk order discussion for festive stock',
        tag: 'Wholesale',
      },
      {
        id: 'lead-kunal',
        leadName: 'Kunal Jain',
        businessName: 'Jain Home Decor',
        source: 'Website form',
        owner: 'Aman',
        estimatedValue: 'Rs 27,500',
        note: 'Comparing two package options this week',
        tag: 'Decision soon',
      },
    ],
  },
  {
    id: 'won',
    label: 'Won',
    caption: 'Confirmed business and payment follow-through',
    accent: 'teal',
    leads: [
      {
        id: 'lead-rohit',
        leadName: 'Rohit Khandelwal',
        businessName: 'R K Coaching Centre',
        source: 'Existing customer',
        owner: 'Aman',
        estimatedValue: 'Rs 64,000',
        note: 'Second batch confirmed and payment split requested',
        tag: 'Repeat customer',
      },
    ],
  },
  {
    id: 'lost',
    label: 'Lost',
    caption: 'No current opportunity or closed out',
    accent: 'rose',
    leads: [],
  },
]

const allLeads = leadsPipelineColumns.flatMap((column) => column.leads)

export const leadsPipelineStats = {
  totalLeads: allLeads.length,
  qualifiedLeads: leadsPipelineColumns.find((column) => column.id === 'qualified')
    .leads.length,
  wonLeads: leadsPipelineColumns.find((column) => column.id === 'won').leads.length,
}

