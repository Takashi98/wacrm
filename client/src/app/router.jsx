import { Navigate, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import PublicOnlyRoute from '../features/auth/components/PublicOnlyRoute'
import AppShell from '../layouts/AppShell'
import AnalyticsPage from '../pages/AnalyticsPage'
import AutomationsPage from '../pages/AutomationsPage'
import InboxPage from '../pages/InboxPage'
import LeadsPage from '../pages/LeadsPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import PaymentsPage from '../pages/PaymentsPage'
import SignupPage from '../pages/SignupPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicOnlyRoute>
        <SignupPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/inbox" replace />,
      },
      {
        path: 'inbox',
        element: <InboxPage />,
      },
      {
        path: 'leads',
        element: <LeadsPage />,
      },
      {
        path: 'automations',
        element: <AutomationsPage />,
      },
      {
        path: 'payments',
        element: <PaymentsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
