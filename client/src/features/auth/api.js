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

export function signupRequest(payload) {
  return request('/auth/signup', {
    method: 'POST',
    body: payload,
  })
}

export function loginRequest(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function getCurrentUserRequest() {
  return request('/auth/me')
}

export function logoutRequest() {
  return request('/auth/logout', {
    method: 'POST',
  })
}
