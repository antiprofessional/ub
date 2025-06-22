export interface DeviceInfo {
  userAgent: string
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  device: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screen: {
    width: number
    height: number
    colorDepth: number
  }
  timezone: string
  language: string
  cookieEnabled: boolean
  javaEnabled: boolean
}

export interface LocationInfo {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  city: string
  country: string
  region: string
  timezone: string
  isp: string
  error: string | null
}

export interface IPInfo {
  ip: string
  city: string
  region: string
  country: string
  countryCode: string
  timezone: string
  isp: string
  org: string
  as: string
  lat: number
  lon: number
}

export function detectDevice(): DeviceInfo {
  const userAgent = navigator.userAgent

  // Browser detection
  let browser = "Unknown"
  let browserVersion = "Unknown"

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome"
    const match = userAgent.match(/Chrome\/([0-9.]+)/)
    browserVersion = match ? match[1] : "Unknown"
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox"
    const match = userAgent.match(/Firefox\/([0-9.]+)/)
    browserVersion = match ? match[1] : "Unknown"
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari"
    const match = userAgent.match(/Version\/([0-9.]+)/)
    browserVersion = match ? match[1] : "Unknown"
  } else if (userAgent.includes("Edg")) {
    browser = "Edge"
    const match = userAgent.match(/Edg\/([0-9.]+)/)
    browserVersion = match ? match[1] : "Unknown"
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    browser = "Opera"
    const match = userAgent.match(/(Opera|OPR)\/([0-9.]+)/)
    browserVersion = match ? match[2] : "Unknown"
  }

  // OS detection
  let os = "Unknown"
  let osVersion = "Unknown"

  if (userAgent.includes("Windows NT")) {
    os = "Windows"
    const match = userAgent.match(/Windows NT ([0-9.]+)/)
    osVersion = match ? match[1] : "Unknown"
  } else if (userAgent.includes("Mac OS X")) {
    os = "macOS"
    const match = userAgent.match(/Mac OS X ([0-9_]+)/)
    osVersion = match ? match[1].replace(/_/g, ".") : "Unknown"
  } else if (userAgent.includes("Linux")) {
    os = "Linux"
  } else if (userAgent.includes("Android")) {
    os = "Android"
    const match = userAgent.match(/Android ([0-9.]+)/)
    osVersion = match ? match[1] : "Unknown"
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS"
    const match = userAgent.match(/OS ([0-9_]+)/)
    osVersion = match ? match[1].replace(/_/g, ".") : "Unknown"
  }

  // Device type detection
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)
  const isDesktop = !isMobile && !isTablet

  let device = "Desktop"
  if (isMobile && !isTablet) device = "Mobile"
  if (isTablet) device = "Tablet"

  return {
    userAgent,
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    isMobile,
    isTablet,
    isDesktop,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    javaEnabled: typeof navigator.javaEnabled === "function" ? navigator.javaEnabled() : false,
  }
}

export function getGeolocation(): Promise<LocationInfo> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: null,
        longitude: null,
        accuracy: null,
        city: "Unknown",
        country: "Unknown",
        region: "Unknown",
        timezone: "Unknown",
        isp: "Unknown",
        error: "Geolocation not supported",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          city: "Unknown", // Will be filled by IP lookup
          country: "Unknown",
          region: "Unknown",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isp: "Unknown",
          error: null,
        })
      },
      (error) => {
        resolve({
          latitude: null,
          longitude: null,
          accuracy: null,
          city: "Unknown",
          country: "Unknown",
          region: "Unknown",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isp: "Unknown",
          error: error.message,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  })
}
