export const automationRules = [
  {
    id: 'rule-followup-no-reply',
    name: 'Follow up after no reply',
    status: 'active',
    trigger: 'If a lead does not reply within 6 hours',
    action: 'Send one WhatsApp follow-up and notify the owner',
    scope: 'Inbox follow-up',
    lastEvent: 'Ran today at 10:30 AM',
  },
  {
    id: 'rule-hot-lead-owner',
    name: 'Notify owner for hot leads',
    status: 'active',
    trigger: 'When a conversation is marked as hot',
    action: 'Notify the assigned owner in the dashboard',
    scope: 'Lead alerts',
    lastEvent: 'Updated yesterday',
  },
  {
    id: 'rule-payment-reminder',
    name: 'Payment reminder after quote',
    status: 'inactive',
    trigger: 'One day after a payment link is shared',
    action: 'Queue a payment reminder for the customer',
    scope: 'Payments',
    lastEvent: 'Paused 2 days ago',
  },
  {
    id: 'rule-new-inquiry-tag',
    name: 'Tag fresh Instagram inquiries',
    status: 'active',
    trigger: 'When a new lead comes from Instagram',
    action: 'Add the New Inquiry tag and place the lead in New',
    scope: 'Lead routing',
    lastEvent: 'Ran yesterday at 6:10 PM',
  },
]

export const automationTemplates = [
  {
    id: 'tpl-reply',
    title: 'No reply reminder',
    description: 'One simple follow-up if the customer stops responding.',
  },
  {
    id: 'tpl-owner',
    title: 'Owner notification',
    description: 'Alert the assigned owner when a lead becomes urgent.',
  },
]

export const automationStats = {
  totalRules: automationRules.length,
  activeRules: automationRules.filter((rule) => rule.status === 'active').length,
  inactiveRules: automationRules.filter((rule) => rule.status === 'inactive')
    .length,
}

