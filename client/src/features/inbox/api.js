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

export function getInboxConversationsRequest() {
  return request('/inbox/conversations')
}

export function getConversationDetailRequest(conversationId) {
  return request(`/inbox/conversations/${conversationId}`)
}

export function createLeadFromConversationRequest(conversationId, payload) {
  return request(`/inbox/conversations/${conversationId}/lead`, {
    method: 'POST',
    body: payload,
  })
}
