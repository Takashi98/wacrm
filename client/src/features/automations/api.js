const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

async function request(path, options = {}) {
  const hasBody = typeof options.body !== 'undefined'
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed')
    error.statusCode = response.status
    throw error
  }

  return data
}

export function getAutomationsRequest() {
  return request('/automations')
}

export function createAutomationRequest(payload) {
  return request('/automations', {
    method: 'POST',
    body: payload,
  })
}

export function updateAutomationStatusRequest(automationId, status) {
  return request(`/automations/${automationId}/status`, {
    method: 'PATCH',
    body: { status },
  })
}
