import { parsePhoneNumberFromString } from 'libphonenumber-js'

// Цифры с кодом страны: "8 (912) 443-40-49" → "79124434049", null для некорректного номера
export const normalizePhone = (input: string) => {
  const phone = parsePhoneNumberFromString(input, 'RU')
  return phone?.isValid() ? phone.number.slice(1) : null
}

// "79124434049" → "+7 912 443 4049"
export const formatPhone = (digits: string) => {
  const phone = `+${digits}`
  return parsePhoneNumberFromString(phone)?.formatInternational() ?? phone
}
