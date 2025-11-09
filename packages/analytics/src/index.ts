/// <reference types="vite/client" />

type GtagCommand = [command: string, ...params: unknown[]]

declare global {
  interface ImportMetaEnv {
    readonly VITE_ANALYTICS_ID?: string
  }

  interface Window {
    dataLayer?: GtagCommand[]
    gtag?: (...args: GtagCommand) => void
  }
}

const defaultMeasurementId = import.meta.env.VITE_ANALYTICS_ID

let isInitialized = false
let activeMeasurementId: string | undefined

const hasWindow = () => typeof window !== 'undefined'

const resolveMeasurementId = (override?: string) => override ?? activeMeasurementId ?? defaultMeasurementId

const loadGtagScript = (id: string) => {
  if (!hasWindow()) {
    return
  }

  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)
}

export const initAnalytics = (measurementId?: string) => {
  if (!hasWindow()) {
    return
  }

  if (isInitialized) {
    return
  }

  const resolvedId = resolveMeasurementId(measurementId)

  if (!resolvedId) {
    if (import.meta.env.DEV) {
      console.info('Analytics disabled: missing VITE_ANALYTICS_ID.')
    }
    return
  }

  activeMeasurementId = resolvedId

  window.dataLayer = window.dataLayer ?? []

  window.gtag =
    window.gtag ??
    ((...args: GtagCommand) => {
      window.dataLayer!.push(args)
    })

  loadGtagScript(resolvedId)

  window.gtag('js', new Date())
  window.gtag('config', resolvedId, { send_page_view: false })
  isInitialized = true
}

export const trackPageView = (path?: string, title?: string) => {
  if (!hasWindow()) {
    return
  }

  const measurementId = resolveMeasurementId()
  if (!measurementId || !window.gtag) {
    return
  }

  const pagePath = path ?? `${window.location.pathname}${window.location.search}`

  window.gtag('event', 'page_view', {
    page_title: title ?? document.title,
    page_path: pagePath,
    send_to: measurementId
  })
}

export const setAnalyticsUser = (userId: string | null) => {
  if (!hasWindow() || !window.gtag) {
    return
  }

  if (!userId) {
    window.gtag('set', { user_id: undefined })
    return
  }

  window.gtag('set', { user_id: userId })
}
