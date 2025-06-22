"use client"

import { useEffect, useState } from "react"

interface CardInfo {
  type: string
  bank: string
  country: string
  isValid: boolean
}

interface CardInfoDisplayProps {
  cardNumber: string
}

export function CardInfoDisplay({ cardNumber }: CardInfoDisplayProps) {
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    type: "unknown",
    bank: "Unknown",
    country: "Unknown",
    isValid: false,
  })

  useEffect(() => {
    if (cardNumber.replace(/\D/g, "").length >= 6) {
      const cleaned = cardNumber.replace(/\D/g, "")
      let type = "unknown"

      if (cleaned.match(/^4/)) type = "visa"
      else if (cleaned.match(/^5[1-5]/) || cleaned.match(/^2[2-7]/)) type = "mastercard"
      else if (cleaned.match(/^3[47]/)) type = "amex"
      else if (cleaned.match(/^6(?:011|5)/)) type = "discover"

      setCardInfo({
        type,
        bank: "Issuing Bank",
        country: "Unknown",
        isValid: type !== "unknown",
      })
    } else {
      setCardInfo({
        type: "unknown",
        bank: "Unknown",
        country: "Unknown",
        isValid: false,
      })
    }
  }, [cardNumber])

  if (!cardInfo.isValid || cardNumber.replace(/\D/g, "").length < 6) {
    return null
  }

  return (
    <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-lg">💳</span>
        <span className="font-medium text-gray-900 capitalize">{cardInfo.type}</span>
        <span className="text-sm text-gray-600">• {cardInfo.bank}</span>
      </div>
    </div>
  )
}
