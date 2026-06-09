const ASSET_EXTENSION_PATTERN =
  /\.(?:avif|bmp|css|gif|ico|jpe?g|js|json|mjs|pdf|png|svg|txt|webm|webp|woff2?|xml|zip)$/i

const BLOCKED_PATH_SEGMENTS = ['/admin', '/login', '/signin', '/sign-in', '/auth']

export function normalizeDiscoveredUrl(rawUrl: string, rootUrl: string): string | null {
  if (
    !rawUrl ||
    rawUrl.startsWith('mailto:') ||
    rawUrl.startsWith('tel:') ||
    rawUrl.startsWith('javascript:')
  ) {
    return null
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(rawUrl, rootUrl)
  } catch {
    return null
  }

  const root = new URL(rootUrl)
  if (parsedUrl.origin !== root.origin) {
    return null
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return null
  }

  parsedUrl.hash = ''
  parsedUrl.search = ''

  if (parsedUrl.pathname.length > 1) {
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, '')
  }

  const pathname = parsedUrl.pathname.toLowerCase()
  if (ASSET_EXTENSION_PATTERN.test(pathname)) {
    return null
  }

  if (BLOCKED_PATH_SEGMENTS.some((segment) => pathname.includes(segment))) {
    return null
  }

  return parsedUrl.toString()
}

export function createUrlLabel(url: string): string {
  const parsedUrl = new URL(url)
  const lastSegment = parsedUrl.pathname.split('/').filter(Boolean).at(-1)

  if (!lastSegment) {
    return parsedUrl.hostname
  }

  return lastSegment.replace(/[-_]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}
