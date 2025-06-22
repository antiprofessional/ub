export function isValidCardNumber(cardNumber: string): boolean {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, "")

  // Check if it's 13-19 digits (common card lengths)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }

  // Luhn algorithm for card validation
  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleaned.charAt(i), 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export function isValidExpiryDate(expiry: string): boolean {
  const cleaned = expiry.replace(/\D/g, "")
  if (cleaned.length !== 4) return false

  const month = Number.parseInt(cleaned.substring(0, 2), 10)
  const year = Number.parseInt(cleaned.substring(2, 4), 10)

  if (month < 1 || month > 12) return false

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }

  return true
}

export function isValidSecurityCode(code: string): boolean {
  const cleaned = code.replace(/\D/g, "")
  return cleaned.length >= 3 && cleaned.length <= 4
}

// International postcode/zip validation
export function isValidPostalCode(postalCode: string, country: string): boolean {
  const cleaned = postalCode.trim()

  switch (country) {
    case "United States":
      // US ZIP: 12345 or 12345-6789
      return /^\d{5}(-\d{4})?$/.test(cleaned)
    case "Canada":
      // Canadian postal: A1A 1A1
      return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(cleaned)
    case "United Kingdom":
      // UK postcode: SW1A 1AA
      return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(cleaned)
    case "Germany":
      // German postal: 12345
      return /^\d{5}$/.test(cleaned)
    case "France":
      // French postal: 12345
      return /^\d{5}$/.test(cleaned)
    case "Australia":
      // Australian postal: 1234
      return /^\d{4}$/.test(cleaned)
    case "Japan":
      // Japanese postal: 123-4567
      return /^\d{3}-\d{4}$/.test(cleaned)
    case "Netherlands":
      // Dutch postal: 1234 AB
      return /^\d{4}\s?[A-Z]{2}$/i.test(cleaned)
    default:
      // Generic validation - at least 3 characters
      return cleaned.length >= 3 && cleaned.length <= 10
  }
}

export function isValidFullName(name: string): boolean {
  return name.trim().length >= 2 && /^[a-zA-Z\s\-'.]+$/.test(name.trim())
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  const groups = cleaned.match(/.{1,4}/g) || []
  return groups.join(" ").substring(0, 19) // Max 16 digits + 3 spaces
}

export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
  }
  return cleaned
}

export function getPostalCodePlaceholder(country: string): string {
  switch (country) {
    case "United States":
      return "12345 or 12345-6789"
    case "Canada":
      return "A1A 1A1"
    case "United Kingdom":
      return "SW1A 1AA"
    case "Germany":
    case "France":
      return "12345"
    case "Australia":
      return "1234"
    case "Japan":
      return "123-4567"
    case "Netherlands":
      return "1234 AB"
    default:
      return "Enter postal code"
  }
}
