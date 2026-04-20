import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AuthStatusScreen from './AuthStatusScreen'

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <AuthStatusScreen
        title="Checking your session"
        description="Please wait while WACRM decides where to send you."
      />
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/inbox" replace />
  }

  return children
}

export default PublicOnlyRoute
