import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get IP from headers
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwarded?.split(",")[0] || realIp || "Unknown"

    // Get detailed IP information from ipapi.co
    let ipInfo = null

    if (ip && ip !== "Unknown" && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; IPLookup/1.0)",
          },
        })

        if (response.ok) {
          ipInfo = await response.json()
        }
      } catch (error) {
        console.error("IP lookup failed:", error)
      }
    }

    // Fallback IP info structure
    const defaultIpInfo = {
      ip: ip || "Unknown",
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      countryCode: "Unknown",
      timezone: "Unknown",
      isp: "Unknown",
      org: "Unknown",
      as: "Unknown",
      lat: 0,
      lon: 0,
    }

    return NextResponse.json({
      success: true,
      ip: ip || "Unknown",
      ipInfo: ipInfo || defaultIpInfo,
    })
  } catch (error) {
    console.error("Error getting IP info:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to get IP information",
      ip: "Unknown",
      ipInfo: null,
    })
  }
}
