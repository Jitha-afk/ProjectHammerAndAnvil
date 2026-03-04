import { useCallback, useSyncExternalStore } from 'react'

type Route = '/' | '/about' | '/share' | '/checklist' | '/not-found'

function getHashRoute(): Route {
  const hash = window.location.hash.replace('#', '') || '/'
  const validRoutes: Route[] = ['/', '/about', '/share', '/checklist', '/not-found']
  return validRoutes.includes(hash as Route) ? (hash as Route) : '/not-found'
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function useHashRoute() {
  const route = useSyncExternalStore(subscribe, getHashRoute, getHashRoute)

  const navigate = useCallback((to: Route) => {
    window.location.hash = to
  }, [])

  return { route, navigate }
}
