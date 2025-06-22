"use client"
import { useEffect, useState } from "react"
import { CheckCircle, User, CreditCard, MapPin } from "lucide-react"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Updating your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black px-6 py-4">
        <div className="text-white text-2xl font-medium">Uber</div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-16 pb-8">
        <div className="max-w-md mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-normal text-black mb-4">Account Updated Successfully!</h1>
            <p className="text-gray-600">Your Uber account has been updated with the latest information.</p>
          </div>

          {/* Status Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-medium text-black">Login Information</h3>
                  <p className="text-sm text-gray-600">Account credentials verified</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-medium text-black">Payment Method</h3>
                  <p className="text-sm text-gray-600">Card information updated</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-medium text-black">Personal Information</h3>
                  <p className="text-sm text-gray-600">Profile details updated</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
            <p className="text-sm text-blue-800">
              Your account is now fully updated and ready to use. You can start booking rides with your updated payment
              method and personal information.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for keeping your Uber account up to date!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
