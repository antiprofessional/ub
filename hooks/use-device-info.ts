"use client"

import { useState, useEffect } from "react"
import { detectDevice, getGeolocation } from "../lib/device-detection"
import type { DeviceInfo, LocationInfo, IPInfo } from "../lib/device-detection"

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [ipInfo, setIPInfo] = useState<IPInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const collectDeviceInfo = async () => {
      try {
        // Get device information
        const device = detectDevice()
        setDeviceInfo(device)

        // Get IP information
        const ipResponse = await fetch("/api/get-ip")
        const ipData = await ipResponse.json()
        if (ipData.success) {
          setIPInfo(ipData.ipInfo)
        }

        // Get geolocation
        const location = await getGeolocation()
        setLocationInfo(location)
      } catch (error) {
        console.error("Error collecting device info:", error)
      } finally {
        setIsLoading(false)
      }
    }

    collectDeviceInfo()
  }, [])

  return {
    deviceInfo,
    locationInfo,
    ipInfo,
    isLoading,
  }
}
