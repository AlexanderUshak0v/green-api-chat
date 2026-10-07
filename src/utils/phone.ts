import { parsePhoneNumberFromString } from 'libphonenumber-js'

/**
 * Приводит номер к цифрам с кодом страны: "8 (912) 443-40-49" → "79124434049".
 * Возвращает null, если номер некорректный.
 */
export function normalizePhone(input: string): string | null {
  const phone = parsePhoneNumberFromString(input, 'RU')
  if (!phone?.isValid()) {
    return null
  }
  return phone.number.slice(1)
}

/** "79124434049" → "+7 912 443 4049" */
export function formatPhone(digits: string): string {
  return parsePhoneNumberFromString(`+${digits}`)?.formatInternational() ?? `+${digits}`
}
