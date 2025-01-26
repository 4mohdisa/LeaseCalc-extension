import { parse, isValid } from 'date-fns'

export function createSafeDate(dateString: string): Date | null {
  // Try common date formats
  const formats = [
    'dd/MM/yyyy',
    'MM/dd/yyyy',
    'yyyy-MM-dd',
    'dd-MM-yyyy',
    'MM-dd-yyyy'
  ]

  for (const format of formats) {
    const date = parse(dateString, format, new Date())
    if (isValid(date)) {
      return date
    }
  }

  // If no format works, try parsing as ISO string
  const isoDate = new Date(dateString)
  if (isValid(isoDate)) {
    return isoDate
  }

  return null
}
