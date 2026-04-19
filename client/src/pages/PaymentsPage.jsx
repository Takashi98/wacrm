import PaymentsHeader from '../features/payments/components/PaymentsHeader'
import PaymentsSidebar from '../features/payments/components/PaymentsSidebar'
import PaymentTable from '../features/payments/components/PaymentTable'
import {
  paymentRecords,
  paymentStats,
  paymentSidebarInsights,
} from '../features/payments/mockData'

function PaymentsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <PaymentsHeader stats={paymentStats} />

      <section className="min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-white shadow-sm">
            <PaymentTable records={paymentRecords} />
          </div>

          <div className="flex min-h-0 flex-col gap-3">
            <PaymentsSidebar insights={paymentSidebarInsights} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default PaymentsPage

