import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AuthStatusScreen from './AuthStatusScreen'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <AuthStatusScreen
        title="Loading your workspace"
        description="WACRM is checking your session before opening the app."
      />
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
