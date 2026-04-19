import LeadCard from '../features/leads/components/LeadCard'
import LeadsHeader from '../features/leads/components/LeadsHeader'
import PipelineColumn from '../features/leads/components/PipelineColumn'
import { leadsPipelineColumns, leadsPipelineStats } from '../features/leads/mockData'

function LeadsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <LeadsHeader stats={leadsPipelineStats} />

      <section className="min-h-0 flex-1">
        <div className="hidden h-full min-h-0 lg:block">
          <div className="grid h-full min-h-0 grid-cols-5 gap-3">
            {leadsPipelineColumns.map((column) => (
              <PipelineColumn
                key={column.id}
                column={column}
                renderLead={(lead) => <LeadCard key={lead.id} lead={lead} />}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:hidden">
          {leadsPipelineColumns.map((column) => (
            <PipelineColumn
              key={column.id}
              column={column}
              mobile
              renderLead={(lead) => <LeadCard key={lead.id} lead={lead} />}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default LeadsPage

