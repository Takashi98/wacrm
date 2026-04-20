function formatCurrency(value) {
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

function isYesterday(value, now) {
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  return isSameDay(value, yesterday)
}

function formatPaymentTimestamp(dateInput) {
  if (!dateInput) {
    return 'Updated recently'
  }

  const value = new Date(dateInput)

  if (Number.isNaN(value.getTime())) {
    return 'Updated recently'
  }

  const now = new Date()

  if (isSameDay(value, now)) {
    return `Updated today, ${formatClock(value)}`
  }

  if (isYesterday(value, now)) {
    return 'Updated yesterday'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

export function normalizePaymentRecord(paymentLink) {
  return {
    id: paymentLink.id,
    leadId: paymentLink.leadId,
    customerName: paymentLink.leadName || 'Unknown lead',
    businessName: paymentLink.businessName || 'Business name pending',
    source: paymentLink.source || 'Not set',
    amountValue: paymentLink.amount || 0,
    amount: formatCurrency(paymentLink.amount || 0),
    status: paymentLink.status || 'Pending',
    createdAt: formatPaymentTimestamp(paymentLink.updatedAt || paymentLink.createdAt),
    linkUrl: paymentLink.linkUrl || '',
    note: paymentLink.note || '',
  }
}

export function buildPaymentStats(records) {
  const collectedAmount = records
    .filter((record) => record.status === 'Paid')
    .reduce((total, record) => total + record.amountValue, 0)

  return {
    totalLinks: records.length,
    pendingLinks: records.filter((record) => record.status === 'Pending').length,
    collectedAmount: formatCurrency(collectedAmount),
  }
}

export function normalizeLeadOption(lead) {
  return {
    value: lead.id,
    label: lead.businessName
      ? `${lead.name} - ${lead.businessName}`
      : lead.name,
    source: lead.source || 'Not set',
    defaultAmount: lead.value || 0,
  }
}
