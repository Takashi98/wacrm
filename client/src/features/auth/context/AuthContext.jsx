import { useEffect, useRef, useState } from 'react'
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  signupRequest,
} from '../api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const hasLoadedSessionRef = useRef(false)
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)
  const [workspace, setWorkspace] = useState(null)

  async function hydrateSession() {
    try {
      const data = await getCurrentUserRequest()

      setUser(data.user)
      setWorkspace(data.workspace)
      setStatus('authenticated')
    } catch {
      setUser(null)
      setWorkspace(null)
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    if (hasLoadedSessionRef.current) {
      return
    }

    hasLoadedSessionRef.current = true
    hydrateSession()
  }, [])

  async function signup(payload) {
    const data = await signupRequest(payload)

    setUser(data.user)
    setWorkspace(data.workspace)
    setStatus('authenticated')

    return data
  }

  async function login(payload) {
    const data = await loginRequest(payload)

    setUser(data.user)
    setWorkspace(data.workspace)
    setStatus('authenticated')

    return data
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
      setWorkspace(null)
      setStatus('unauthenticated')
    }
  }

  const value = {
    login,
    logout,
    signup,
    status,
    user,
    workspace,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
