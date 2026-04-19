import AnalyticsHeader from '../features/analytics/components/AnalyticsHeader'
import AnalyticsMetricCard from '../features/analytics/components/AnalyticsMetricCard'
import AnalyticsPanel from '../features/analytics/components/AnalyticsPanel'
import AnalyticsSidebar from '../features/analytics/components/AnalyticsSidebar'
import {
  analyticsHeaderStats,
  analyticsMetrics,
  analyticsSourceBreakdown,
  analyticsSidebarInsights,
  analyticsTrendBars,
} from '../features/analytics/mockData'

function AnalyticsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <AnalyticsHeader stats={analyticsHeaderStats} />

      <section className="min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-h-0 flex-col gap-3">
            <div className="grid gap-3 md:grid-cols-3">
              {analyticsMetrics.map((metric) => (
                <AnalyticsMetricCard key={metric.id} metric={metric} />
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <AnalyticsPanel
                eyebrow="Revenue trend"
                title="Weekly performance"
                description="Simple mock trend bars to show how revenue and lead flow can be tracked over time."
              >
                <div className="space-y-4">
                  {analyticsTrendBars.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-700">
                          {item.label}
                        </span>
                        <span className="text-slate-500">{item.value}</span>
                      </div>
                      <div className="mt-2 h-3 rounded-full bg-slate-200">
                        <div
                          className="h-3 rounded-full bg-emerald-600"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </AnalyticsPanel>

              <AnalyticsPanel
                eyebrow="Pipeline health"
                title="Current business snapshot"
                description="A simple readout of the most useful numbers for day-to-day SMB operators."
              >
                <div className="space-y-3">
                  {[
                    ['Conversion rate', '24%'],
                    ['Won leads', '12'],
                    ['Open opportunities', '18'],
                    ['Average ticket', 'Rs 15,700'],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl bg-[color:var(--panel-soft)] px-4 py-3"
                    >
                      <span className="text-sm text-slate-600">{label}</span>
                      <span className="text-sm font-semibold text-slate-950">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </AnalyticsPanel>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
              <AnalyticsPanel
                eyebrow="Sources"
                title="Lead source mix"
                description="A simple source breakdown to help operators see where business is currently coming from."
              >
                <div className="space-y-3">
                  {analyticsSourceBreakdown.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <span className="text-sm font-semibold text-slate-950">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </AnalyticsPanel>

              <AnalyticsPanel
                eyebrow="Empty state"
                title="No custom reports yet"
                description="Saved reports, date comparisons, or exported views can appear here later without changing the shell."
              >
                <div className="rounded-[20px] border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-900">
                    Custom reporting is not set up yet
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    This space is reserved for deeper business reports once the
                    analytics module grows beyond the MVP shell.
                  </p>
                </div>
              </AnalyticsPanel>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-3">
            <AnalyticsSidebar insights={analyticsSidebarInsights} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AnalyticsPage

