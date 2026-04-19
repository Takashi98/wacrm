import AutomationSidebar from '../features/automations/components/AutomationSidebar'
import AutomationsHeader from '../features/automations/components/AutomationsHeader'
import AutomationTable from '../features/automations/components/AutomationTable'
import {
  automationRules,
  automationStats,
  automationTemplates,
} from '../features/automations/mockData'

function AutomationsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <AutomationsHeader stats={automationStats} />

      <section className="min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-white shadow-sm">
            <AutomationTable rules={automationRules} />
          </div>

          <div className="flex min-h-0 flex-col gap-3">
            <AutomationSidebar templates={automationTemplates} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AutomationsPage

