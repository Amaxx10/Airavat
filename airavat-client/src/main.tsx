import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from 'react-router-dom'
import { ClosetPage } from './pages/ClosetPage'
import { AIStylingPage } from './pages/AIStylingPage'
import { TryOnPage } from './pages/TryOnPage'
import { FeedPage } from './pages/FeedPage'
import { ProfilePage } from './pages/ProfilePage'
import { PreferencesPage } from './pages/PreferencesPage'
import App from './App'
import { useEffect } from 'react'
import { CalendarEventsPage } from './pages/CalendarEventsPage'

const tmp = 'h-screen bg-black text-white text-4xl text-center grid place-items-center'

function PreferencesCheck() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const hasPreferences = localStorage.getItem('stylePreferences');
    if (!hasPreferences) {
      navigate('/preferences');
    }
  }, [navigate]);

  return <ClosetPage />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div className={tmp}>Oops.. There seems to be a problem.</div>,
    children: [
      {
        path: '/',
        element: <PreferencesCheck />,
      },
      {
        path: '/closet',
        element: <ClosetPage />,
      },
      {
        path: '/styling',
        element: <AIStylingPage />,
      },
      {
        path: '/try-on',
        element: <TryOnPage />,
      },
      {
        path: '/feed',
        element: <FeedPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/preferences',
        element: <PreferencesPage />,
      },
      {
        path: '/calendar',
        element: <CalendarEventsPage />,
      }
    ]
  }
]);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
