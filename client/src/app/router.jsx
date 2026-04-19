import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import AnalyticsPage from '../pages/AnalyticsPage'
import AutomationsPage from '../pages/AutomationsPage'
import InboxPage from '../pages/InboxPage'
import LeadsPage from '../pages/LeadsPage'
import NotFoundPage from '../pages/NotFoundPage'
import PaymentsPage from '../pages/PaymentsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
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
