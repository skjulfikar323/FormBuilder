import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@features/auth/store/authStore.js'
import { ThemeApplier } from '@features/theme/ThemeApplier.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
})

export function AppProviders({ children }) {
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeApplier />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(240 10% 8%)',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
              padding: '10px 14px',
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
