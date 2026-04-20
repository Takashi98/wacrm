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

function formatAutomationTimestamp(dateInput) {
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

export function normalizeAutomationRule(rule) {
  return {
    id: rule.id,
    name: rule.name,
    trigger: rule.trigger,
    action: rule.action,
    scope: rule.scope || 'General',
    status: rule.status || 'inactive',
    lastEvent: formatAutomationTimestamp(rule.updatedAt || rule.createdAt),
  }
}

export function buildAutomationStats(rules) {
  return {
    totalRules: rules.length,
    activeRules: rules.filter((rule) => rule.status === 'active').length,
    inactiveRules: rules.filter((rule) => rule.status === 'inactive').length,
  }
}
