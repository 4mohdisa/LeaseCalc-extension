import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CalculationResult {
  advance: number
  bond: number
  total: number
}

export function RentCalculator() {
  const [weeklyRent, setWeeklyRent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CalculationResult | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const rentAmount = parseFloat(weeklyRent)
    
    if (isNaN(rentAmount) || rentAmount <= 0) {
      setError("Please enter a valid weekly rent amount")
      setResult(null)
      return
    }

    const advance = rentAmount * 2
    const bond = rentAmount <= 800 ? rentAmount * 4 : rentAmount * 6
    const total = advance + bond

    setResult({ advance, bond, total })
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent Calculator</CardTitle>
        <CardDescription>
          Calculate your move-in costs including bond and rent in advance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Weekly Rent Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter weekly rent"
                value={weeklyRent}
                onChange={(e) => setWeeklyRent(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            {result && (
              <div className="rounded-md bg-muted p-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Two Weeks Advance:</span> ${result.advance}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Bond Amount:</span> ${result.bond}
                </div>
                <div className="text-sm font-semibold">
                  <span>Total Move-in Cost:</span> ${result.total}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Calculate Costs
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}