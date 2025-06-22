export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: string): boolean {
  // Basic phone validation - digits only, 10-15 characters
  const phoneRegex = /^\+?[\d\s\-()]{10,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export function isValidEmailOrPhone(input: string): boolean {
  if (!input.trim()) return false

  // Check if it contains @ symbol (likely email)
  if (input.includes("@")) {
    return isValidEmail(input)
  } else {
    return isValidPhoneNumber(input)
  }
}

export function isValidPassword(password: string): boolean {
  // Password should be at least 6 characters
  return password.length >= 6
}
