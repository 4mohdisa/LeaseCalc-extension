import { differenceInDays } from 'date-fns'

interface WeeksCalculationResult {
  weeks: number | null;
  error: string | null;
}

function createSafeDate(date: Date | string | null): Date | null {
  if (!date) return null;
  const parsedDate = date instanceof Date ? date : new Date(date);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function calculateWeeksRemaining(moveOut: Date | string | null, endDate: Date | string | null): WeeksCalculationResult {
  const moveOutDate = createSafeDate(moveOut)
  const agreementEndDate = createSafeDate(endDate)

  // Validate dates
  if (!moveOutDate || !agreementEndDate) {
    return {
      weeks: null,
      error: "Please enter a valid date"
    }
  }

  if (moveOutDate > agreementEndDate) {
    return {
      weeks: null,
      error: "Move out date cannot be after end date"
    }
  }
  
  // Get the difference in days
  const diffDays = differenceInDays(agreementEndDate, moveOutDate)
  
  // Calculate complete weeks and remaining days
  const completeWeeks = Math.floor(diffDays / 7)
  const remainingDays = diffDays % 7
  
  // Add an extra week if there are 5 or more remaining days
  return {
    weeks: completeWeeks + (remainingDays >= 5 ? 1 : 0),
    error: null
  }
}
