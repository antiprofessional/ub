export function isValidFullName(name: string): boolean {
  return name.trim().length >= 2 && /^[a-zA-Z\s\-'.]+$/.test(name.trim())
}

export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")
  // Check if it's between 10-15 digits
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function isValidAddress(address: string): boolean {
  return address.trim().length >= 5
}

export function isValidCity(city: string): boolean {
  return city.trim().length >= 2 && /^[a-zA-Z\s\-'.]+$/.test(city.trim())
}

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
    case "France":
      // German/French postal: 12345
      return /^\d{5}$/.test(cleaned)
    case "Australia":
      // Australian postal: 1234
      return /^\d{4}$/.test(cleaned)
    case "Spain":
    case "Italy":
      // Spanish/Italian postal: 12345
      return /^\d{5}$/.test(cleaned)
    default:
      // Generic validation - at least 3 characters
      return cleaned.length >= 3 && cleaned.length <= 10
  }
}

export function isValidDateOfBirth(dateOfBirth: string): boolean {
  if (!dateOfBirth) return false

  const date = new Date(dateOfBirth)
  const today = new Date()
  const age = today.getFullYear() - date.getFullYear()

  // Check if date is valid and person is between 18 and 120 years old
  return !isNaN(date.getTime()) && age >= 18 && age <= 120 && date <= today
}
