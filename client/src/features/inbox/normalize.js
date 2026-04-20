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

function formatConversationTime(dateInput) {
  if (!dateInput) {
    return 'New'
  }

  const value = new Date(dateInput)

  if (Number.isNaN(value.getTime())) {
    return 'New'
  }

  const now = new Date()

  if (isSameDay(value, now)) {
    return formatClock(value)
  }

  if (isYesterday(value, now)) {
    return 'Yesterday'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(value)
}

function formatDetailedTime(dateInput) {
  if (!dateInput) {
    return 'Not updated'
  }

  const value = new Date(dateInput)

  if (Number.isNaN(value.getTime())) {
    return 'Not updated'
  }

  const now = new Date()

  if (isSameDay(value, now)) {
    return formatClock(value)
  }

  if (isYesterday(value, now)) {
    return `Yesterday, ${formatClock(value)}`
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

function formatLastActivity(dateInput) {
  if (!dateInput) {
    return 'Not available'
  }

  const value = new Date(dateInput)

  if (Number.isNaN(value.getTime())) {
    return 'Not available'
  }

  const now = new Date()

  if (isSameDay(value, now)) {
    return `Today, ${formatClock(value)}`
  }

  if (isYesterday(value, now)) {
    return `Yesterday, ${formatClock(value)}`
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

function formatCurrency(value) {
  if (!value) {
    return 'TBD'
  }

  return `Rs ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value)}`
}

function getInitials(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

export function normalizeConversationSummary(conversation) {
  const businessName = conversation.businessName || 'Business name pending'
  const contactName = conversation.contactName || 'Unknown contact'

  return {
    id: conversation.id,
    contactName,
    businessName,
    phone: conversation.phone || 'Not added',
    city: conversation.city || 'Not set',
    preview: conversation.preview || 'No messages yet in this conversation.',
    lastMessageTime: formatConversationTime(conversation.lastMessageAt),
    unreadCount: conversation.unreadCount || 0,
    replyState: conversation.replyState || 'Awaiting reply',
    stage: conversation.stage || 'Contact only',
    assignee: conversation.assigneeName || 'Unassigned',
    initials: getInitials(businessName || contactName || 'WA'),
  }
}

export function normalizeConversationDetail(conversation) {
  const contact = conversation.contact || {}
  const lead = conversation.lead
  const businessName =
    contact.businessName || lead?.businessName || 'Business name pending'
  const contactName = contact.name || lead?.name || 'Unknown contact'
  const notes = lead?.notes
    ? [
        {
          id: `lead-note-${lead.id || 'primary'}`,
          text: lead.notes,
          time: formatLastActivity(lead.updatedAt || lead.createdAt),
        },
      ]
    : []

  return {
    id: conversation.id,
    hasLinkedLead: conversation.hasLinkedLead || Boolean(lead),
    contactName,
    businessName,
    phone: contact.phone || 'Not added',
    city: contact.city || 'Not set',
    source: lead?.source || contact.source || '',
    preview: conversation.preview || 'No messages yet in this conversation.',
    lastMessageTime: formatConversationTime(conversation.lastMessageAt),
    unreadCount: conversation.unreadCount || 0,
    replyState: conversation.replyState || 'Awaiting reply',
    stage: lead?.stage || 'Contact only',
    assignee: conversation.assigneeName || 'Unassigned',
    initials: getInitials(businessName || contactName || 'WA'),
    contact: {
      id: contact.id || '',
      name: contact.name || '',
      businessName: contact.businessName || '',
      phone: contact.phone || '',
      email: contact.email || '',
      city: contact.city || '',
      source: contact.source || '',
    },
    timelineLabel: conversation.lastMessageAt
      ? formatLastActivity(conversation.lastMessageAt)
      : 'Latest activity',
    messages: (conversation.messages || []).map((message) => ({
      id: message.id,
      sender: message.sender,
      text: message.text,
      time: formatDetailedTime(message.createdAt),
    })),
    lead: {
      contactName,
      businessName,
      phone: contact.phone || 'Not added',
      email: contact.email || 'Not added',
      stage: lead?.stage || 'Contact only',
      owner: conversation.assigneeName || 'Unassigned',
      source: lead?.source || contact.source || 'Not set',
      city: contact.city || 'Not set',
      paymentStatus: 'Not started',
      estimatedValue: lead ? formatCurrency(lead.value) : 'TBD',
      tags: lead?.tags || [],
      notes,
      lastActivity:
        formatLastActivity(conversation.lastMessageAt || lead?.updatedAt),
    },
  }
}

export function buildInboxStats(conversations) {
  return {
    totalConversations: conversations.length,
    unreadConversations: conversations.filter(
      (conversation) => conversation.unreadCount > 0,
    ).length,
    awaitingReply: conversations.filter(
      (conversation) => conversation.replyState === 'Awaiting reply',
    ).length,
  }
}
