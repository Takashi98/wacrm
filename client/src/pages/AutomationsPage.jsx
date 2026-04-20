import { useEffect, useRef, useState } from 'react'
import {
  createAutomationRequest,
  getAutomationsRequest,
  updateAutomationStatusRequest,
} from '../features/automations/api'
import CreateAutomationModal from '../features/automations/components/CreateAutomationModal'
import AutomationSidebar from '../features/automations/components/AutomationSidebar'
import AutomationsHeader from '../features/automations/components/AutomationsHeader'
import AutomationTable from '../features/automations/components/AutomationTable'
import { automationTemplates } from '../features/automations/mockData'
import {
  buildAutomationStats,
  normalizeAutomationRule,
} from '../features/automations/normalize'

function AutomationsPage() {
  const hasLoadedAutomationsRef = useRef(false)
  const [rules, setRules] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [interactionErrorMessage, setInteractionErrorMessage] = useState('')
  const [isCreateAutomationOpen, setIsCreateAutomationOpen] = useState(false)
  const [createAutomationModalKey, setCreateAutomationModalKey] = useState(0)
  const [isCreatingAutomation, setIsCreatingAutomation] = useState(false)
  const [createAutomationErrorMessage, setCreateAutomationErrorMessage] =
    useState('')
  const [updatingAutomationId, setUpdatingAutomationId] = useState('')

  useEffect(() => {
    if (hasLoadedAutomationsRef.current) {
      return
    }

    hasLoadedAutomationsRef.current = true

    async function loadAutomations() {
      try {
        const data = await getAutomationsRequest()

        setRules(data.automations.map(normalizeAutomationRule))
        setErrorMessage('')
        setStatus('success')
      } catch (error) {
        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadAutomations()
  }, [])

  async function refreshAutomations() {
    const data = await getAutomationsRequest()

    setRules(data.automations.map(normalizeAutomationRule))
    setInteractionErrorMessage('')
    setStatus('success')
  }

  async function handleCreateAutomation(payload) {
    setCreateAutomationErrorMessage('')
    setInteractionErrorMessage('')
    setIsCreatingAutomation(true)

    try {
      await createAutomationRequest(payload)
      await refreshAutomations()
      setIsCreateAutomationOpen(false)
    } catch (error) {
      setCreateAutomationErrorMessage(error.message)
    } finally {
      setIsCreatingAutomation(false)
    }
  }

  async function handleToggleStatus(automationId, nextStatus) {
    const currentRule = rules.find((rule) => rule.id === automationId)

    if (!currentRule || currentRule.status === nextStatus) {
      return
    }

    setUpdatingAutomationId(automationId)
    setInteractionErrorMessage('')

    try {
      await updateAutomationStatusRequest(automationId, nextStatus)
      await refreshAutomations()
    } catch (error) {
      setInteractionErrorMessage(error.message)
    } finally {
      setUpdatingAutomationId('')
    }
  }

  function handleOpenCreateAutomation() {
    setCreateAutomationErrorMessage('')
    setInteractionErrorMessage('')
    setCreateAutomationModalKey((currentValue) => currentValue + 1)
    setIsCreateAutomationOpen(true)
  }

  const automationStats = buildAutomationStats(rules)

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
        <AutomationsHeader stats={automationStats} />

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
                  Loading automations
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  WACRM is loading workspace automation rules from the backend.
                </p>
              </div>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-[24px] border border-rose-200 bg-white px-6 py-10 text-center shadow-sm">
              <div className="max-w-md">
                <p className="text-sm font-semibold text-slate-900">
                  Could not load automations
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {errorMessage ||
                    'The automations API did not return data for this workspace.'}
                </p>
              </div>
            </div>
          ) : null}

          {status === 'success' ? (
            <div className="flex h-full min-h-0 flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-white shadow-sm">
                <AutomationTable
                  rules={rules}
                  onToggleStatus={handleToggleStatus}
                  updatingAutomationId={updatingAutomationId}
                />
              </div>

              <div className="flex min-h-0 flex-col gap-3">
                <AutomationSidebar
                  templates={automationTemplates}
                  onCreateAutomation={handleOpenCreateAutomation}
                  isCreateDisabled={isCreatingAutomation}
                />
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <CreateAutomationModal
        key={createAutomationModalKey}
        open={isCreateAutomationOpen}
        onClose={() => setIsCreateAutomationOpen(false)}
        onSubmit={handleCreateAutomation}
        isSubmitting={isCreatingAutomation}
        errorMessage={createAutomationErrorMessage}
      />
    </>
  )
}

export default AutomationsPage
