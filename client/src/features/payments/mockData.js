export const paymentRecords = [
  {
    id: 'pay-anjali-01',
    customerName: 'Anjali Mehta',
    businessName: 'Anjali Saree House',
    source: 'Qualified lead',
    amount: 'Rs 38,000',
    status: 'Paid',
    createdAt: 'Created today, 9:10 AM',
  },
  {
    id: 'pay-noor-01',
    customerName: 'Sara Khan',
    businessName: 'Noor Boutique',
    source: 'Retail order',
    amount: 'Rs 12,400',
    status: 'Pending',
    createdAt: 'Sent today, 11:20 AM',
  },
  {
    id: 'pay-rk-02',
    customerName: 'Rohit Khandelwal',
    businessName: 'R K Coaching Centre',
    source: 'Repeat customer',
    amount: 'Rs 64,000',
    status: 'Partial',
    createdAt: 'Updated yesterday',
  },
  {
    id: 'pay-greenleaf-01',
    customerName: 'Maya Kulkarni',
    businessName: 'GreenLeaf Naturals',
    source: 'Website campaign',
    amount: 'Rs 9,500',
    status: 'Expired',
    createdAt: 'Expired 2 days ago',
  },
]

export const paymentStats = {
  totalLinks: paymentRecords.length,
  pendingLinks: paymentRecords.filter((record) => record.status === 'Pending')
    .length,
  collectedAmount: 'Rs 38,000',
}

export const paymentSidebarInsights = [
  {
    id: 'insight-trust',
    title: 'Trust first',
    description:
      'Keep payment requests simple and clear so small business operators can follow up with confidence.',
  },
  {
    id: 'insight-reminders',
    title: 'Reminder space',
    description:
      'Future reminder or resend workflows can sit here without cluttering the payment records list.',
  },
]

