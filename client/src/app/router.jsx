import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import InboxPage from '../pages/InboxPage'
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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
