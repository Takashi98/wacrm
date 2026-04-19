import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import AutomationsPage from '../pages/AutomationsPage'
import InboxPage from '../pages/InboxPage'
import LeadsPage from '../pages/LeadsPage'
import NotFoundPage from '../pages/NotFoundPage'

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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
