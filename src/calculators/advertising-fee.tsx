import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateInput } from '@/components/ui/date-input'
import { differenceInWeeks, parse, isValid } from 'date-fns'
import { createSafeDate } from '@/lib/helpers/date-helpers'

const TERM_OPTIONS = [
  { weeks: 26, label: '6 Months' },
  { weeks: 52, label: '12 Months' }
]

export function AdvertisingFeeCalculator() {
  const [useDates, setUseDates] = useState(true)
  const [advertisingCost, setAdvertisingCost] = useState("")
  const [term, setTerm] = useState(52)
  const [weeksRemaining, setWeeksRemaining] = useState("")
  const [moveOutDate, setMoveOutDate] = useState<Date | null>(null)
  const [agreementEndDate, setAgreementEndDate] = useState<Date | null>(null)
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)

  const [rawMoveOutDate, setRawMoveOutDate] = useState("")
  const [rawEndDate, setRawEndDate] = useState("")

  const calculateWeeksRemaining = (moveOut: Date, endDate: Date) => {
    const weeks = differenceInWeeks(endDate, moveOut)
    return { weeks: weeks > 0 ? weeks : 0 }
  }

  const handleCalculate = () => {
    // Reset any previous errors
    setError(null)
    setDateError(null)

    const cost = parseFloat(advertisingCost)
    if (isNaN(cost) || cost <= 0) {
      setError("Please enter a valid advertising cost")
      setCalculatedFee(null)
      return
    }

    let weeks = 0
    if (useDates) {
      // Try to parse the dates
      let moveOutDateObj = null
      let endDateObj = null

      if (rawMoveOutDate) {
        moveOutDateObj = parse(rawMoveOutDate, "dd/MM/yyyy", new Date())
        if (!isValid(moveOutDateObj)) {
          moveOutDateObj = createSafeDate(rawMoveOutDate)
        }
      }
      if (rawEndDate) {
        endDateObj = parse(rawEndDate, "dd/MM/yyyy", new Date())
        if (!isValid(endDateObj)) {
          endDateObj = createSafeDate(rawEndDate)
        }
      }

      if (!moveOutDateObj || !endDateObj) {
        setDateError("Please enter valid dates")
        setCalculatedFee(null)
        return
      }

      const { weeks: calculatedWeeks } = calculateWeeksRemaining(moveOutDateObj, endDateObj)
      weeks = calculatedWeeks
    } else {
      weeks = parseFloat(weeksRemaining)
      if (isNaN(weeks) || weeks <= 0) {
        setError("Please enter valid weeks remaining")
        setCalculatedFee(null)
        return
      }
    }

    // Calculate the fee: (advertisingCost * weeksRemaining) / (term * 0.75)
    const fee = (cost * weeks) / (term * 0.75)
    setCalculatedFee(fee)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advertising Fee Calculator</CardTitle>
        <CardDescription>
          Calculate the advertising fee based on SACAT guidelines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Agreed Term</Label>
            <Select 
              onValueChange={(value) => setTerm(parseInt(value))}
              defaultValue={term.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select term length" />
              </SelectTrigger>
              <SelectContent>
                {TERM_OPTIONS.map((option) => (
                  <SelectItem key={option.weeks} value={option.weeks.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Advertising Cost ($)</Label>
            <Input
              type="number"
              value={advertisingCost}
              onChange={(e) => setAdvertisingCost(e.target.value)}
              placeholder="Enter advertising cost"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={useDates}
              onCheckedChange={setUseDates}
            />
            <Label>Use dates instead of weeks</Label>
          </div>

          {useDates ? (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Move Out Date</Label>
                <DateInput
                  value={moveOutDate}
                  onChange={(date, raw) => {
                    if (raw !== undefined) setRawMoveOutDate(raw)
                    setMoveOutDate(date)
                  }}
                  label={""}
                  error={dateError}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Agreement End Date</Label>
                <DateInput
                  value={agreementEndDate}
                  onChange={(date, raw) => {
                    if (raw !== undefined) setRawEndDate(raw)
                    setAgreementEndDate(date)
                  }}
                  label={""}
                  error={dateError}
                />
              </div>
              {moveOutDate && agreementEndDate && (
                <div className="rounded-md bg-muted px-3 py-2">
                  <p className="text-sm">
                    Calculated weeks remaining:{' '}
                    <span className="font-medium">
                      {calculateWeeksRemaining(moveOutDate, agreementEndDate).weeks ?? 0}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Label>Weeks Remaining</Label>
              <Input
                type="number"
                value={weeksRemaining}
                onChange={(e) => setWeeksRemaining(e.target.value)}
                placeholder="Enter weeks remaining"
              />
            </div>
          )}

          <Button 
            onClick={handleCalculate}
            className="w-full mt-4"
          >
            Calculate Fee
          </Button>

          {error && (
            <div className="mt-4 p-4 bg-error rounded-lg">
              <p className="text-lg font-semibold">
                {error}
              </p>
            </div>
          )}

          {calculatedFee !== null && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <p className="text-lg font-semibold">
                Calculated Fee: ${calculatedFee.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
