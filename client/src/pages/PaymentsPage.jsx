import { useEffect, useRef, useState } from 'react'
import { getLeadsRequest } from '../features/leads/api'
import CreatePaymentLinkModal from '../features/payments/components/CreatePaymentLinkModal'
import PaymentsHeader from '../features/payments/components/PaymentsHeader'
import PaymentsSidebar from '../features/payments/components/PaymentsSidebar'
import PaymentTable from '../features/payments/components/PaymentTable'
import {
  createPaymentLinkRequest,
  getPaymentLinksRequest,
} from '../features/payments/api'
import { paymentSidebarInsights } from '../features/payments/mockData'
import {
  buildPaymentStats,
  normalizeLeadOption,
  normalizePaymentRecord,
} from '../features/payments/normalize'

function PaymentsPage() {
  const hasLoadedPaymentsRef = useRef(false)
  const [paymentRecords, setPaymentRecords] = useState([])
  const [leadOptions, setLeadOptions] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [interactionErrorMessage, setInteractionErrorMessage] = useState('')
  const [isCreatePaymentLinkOpen, setIsCreatePaymentLinkOpen] = useState(false)
  const [createPaymentLinkModalKey, setCreatePaymentLinkModalKey] = useState(0)
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState(false)
  const [createPaymentLinkErrorMessage, setCreatePaymentLinkErrorMessage] =
    useState('')

  useEffect(() => {
    if (hasLoadedPaymentsRef.current) {
      return
    }

    hasLoadedPaymentsRef.current = true

    async function loadPaymentsData() {
      try {
        const [paymentLinksData, leadsData] = await Promise.all([
          getPaymentLinksRequest(),
          getLeadsRequest(),
        ])

        setPaymentRecords(
          paymentLinksData.paymentLinks.map(normalizePaymentRecord),
        )
        setLeadOptions(leadsData.leads.map(normalizeLeadOption))
        setErrorMessage('')
        setStatus('success')
      } catch (error) {
        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadPaymentsData()
  }, [])

  async function refreshPaymentLinks() {
    const paymentLinksData = await getPaymentLinksRequest()

    setPaymentRecords(paymentLinksData.paymentLinks.map(normalizePaymentRecord))
    setInteractionErrorMessage('')
    setStatus('success')
  }

  async function handleCreatePaymentLink(payload) {
    setCreatePaymentLinkErrorMessage('')
    setInteractionErrorMessage('')
    setIsCreatingPaymentLink(true)

    try {
      await createPaymentLinkRequest(payload)
      await refreshPaymentLinks()
      setIsCreatePaymentLinkOpen(false)
    } catch (error) {
      setCreatePaymentLinkErrorMessage(error.message)
    } finally {
      setIsCreatingPaymentLink(false)
    }
  }

  function handleOpenCreatePaymentLink() {
    setCreatePaymentLinkErrorMessage('')
    setInteractionErrorMessage('')
    setCreatePaymentLinkModalKey((currentValue) => currentValue + 1)
    setIsCreatePaymentLinkOpen(true)
  }

  const paymentStats = buildPaymentStats(paymentRecords)

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
        <PaymentsHeader stats={paymentStats} />

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
                  Loading payment links
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  WACRM is loading workspace payment records from the backend.
                </p>
              </div>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-[24px] border border-rose-200 bg-white px-6 py-10 text-center shadow-sm">
              <div className="max-w-md">
                <p className="text-sm font-semibold text-slate-900">
                  Could not load payments
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {errorMessage ||
                    'The payments API did not return records for this workspace.'}
                </p>
              </div>
            </div>
          ) : null}

          {status === 'success' ? (
            <div className="flex h-full min-h-0 flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-white shadow-sm">
                <PaymentTable records={paymentRecords} />
              </div>

              <div className="flex min-h-0 flex-col gap-3">
                <PaymentsSidebar
                  insights={paymentSidebarInsights}
                  onCreatePaymentLink={handleOpenCreatePaymentLink}
                  isCreateDisabled={!leadOptions.length || isCreatingPaymentLink}
                  hasLeads={Boolean(leadOptions.length)}
                />
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <CreatePaymentLinkModal
        key={createPaymentLinkModalKey}
        open={isCreatePaymentLinkOpen}
        onClose={() => setIsCreatePaymentLinkOpen(false)}
        onSubmit={handleCreatePaymentLink}
        isSubmitting={isCreatingPaymentLink}
        errorMessage={createPaymentLinkErrorMessage}
        leadOptions={leadOptions}
        description="Create a simple payment link from your existing lead list."
      />
    </>
  )
}

export default PaymentsPage
