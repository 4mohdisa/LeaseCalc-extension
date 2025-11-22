import { useState, useEffect } from 'react'
import { calculateWeeksRemaining } from '../utils/dateCalculations'
import { parse, isValid } from 'date-fns'

const TERM_OPTIONS = [
  { label: "6 Months", weeks: 26 },
  { label: "1 Year", weeks: 52 },
  { label: "2 Years", weeks: 104 },
  { label: "3 Years", weeks: 156 },
]

export const Calculator = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab')
    return savedTab || 'rent'
  })

  // Rent Calculator State
  const [weeklyRent, setWeeklyRent] = useState(() => localStorage.getItem('weeklyRent') || '')
  const [rentError, setRentError] = useState('')
  const [rentResults, setRentResults] = useState<{
    advance: number | null
    bond: number | null
    total: number | null
  }>(() => {
    const savedResults = localStorage.getItem('rentResults')
    return savedResults ? JSON.parse(savedResults) : {
      advance: null,
      bond: null,
      total: null
    }
  })

  // Advertising Calculator State
  const [term, setTerm] = useState(() => Number(localStorage.getItem('term')) || 52)
  const [advertisingCost, setAdvertisingCost] = useState(() => localStorage.getItem('advertisingCost') || '')
  const [advertisingError, setAdvertisingError] = useState('')
  const [advertisingFee, setAdvertisingFee] = useState<number | null>(() => {
    const savedFee = localStorage.getItem('advertisingFee')
    return savedFee ? Number(savedFee) : null
  })
  const [useDates, setUseDates] = useState(() => localStorage.getItem('useDates') === 'true')
  const [moveOutDate, setMoveOutDate] = useState(() => localStorage.getItem('moveOutDate') || '')
  const [agreementEndDate, setAgreementEndDate] = useState(() => localStorage.getItem('agreementEndDate') || '')
  const [weeksRemaining, setWeeksRemaining] = useState(() => localStorage.getItem('weeksRemaining') || '')
  const [calculatedAdvertisingWeeks, setCalculatedAdvertisingWeeks] = useState<number | null>(() => {
    const savedWeeks = localStorage.getItem('calculatedAdvertisingWeeks')
    return savedWeeks ? Number(savedWeeks) : null
  })
  const [dateError, setDateError] = useState<string | null>(null)
  const [rawMoveOutDate, setRawMoveOutDate] = useState(() => localStorage.getItem('rawMoveOutDate') || '')
  const [rawEndDate, setRawEndDate] = useState(() => localStorage.getItem('rawEndDate') || '')

  // Reletting Calculator State
  const [relettingRent, setRelettingRent] = useState(() => localStorage.getItem('relettingRent') || '')
  const [lettingFeeWeeks, setLettingFeeWeeks] = useState(() => localStorage.getItem('lettingFeeWeeks') || '1.5')
  const [relettingError, setRelettingError] = useState('')
  const [relettingFee, setRelettingFee] = useState<{
    weeklyRentWithGST: number;
    maximumRelettingFee: number;
  } | null>(() => {
    const savedFee = localStorage.getItem('relettingFee')
    return savedFee ? JSON.parse(savedFee) : null
  })
  const [useDatesReletting, setUseDatesReletting] = useState(() => localStorage.getItem('useDatesReletting') === 'true')
  const [relettingMoveOutDate, setRelettingMoveOutDate] = useState(() => localStorage.getItem('relettingMoveOutDate') || '')
  const [relettingEndDate, setRelettingEndDate] = useState(() => localStorage.getItem('relettingEndDate') || '')
  const [relettingWeeksRemaining, setRelettingWeeksRemaining] = useState(() => localStorage.getItem('relettingWeeksRemaining') || '')
  const [calculatedRelettingWeeks, setCalculatedRelettingWeeks] = useState<number | null>(() => {
    const savedWeeks = localStorage.getItem('calculatedRelettingWeeks')
    return savedWeeks ? Number(savedWeeks) : null
  })

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
    localStorage.setItem('weeklyRent', weeklyRent)
    localStorage.setItem('rentResults', JSON.stringify(rentResults))
    localStorage.setItem('term', term.toString())
    localStorage.setItem('advertisingCost', advertisingCost)
    localStorage.setItem('advertisingFee', advertisingFee?.toString() || '')
    localStorage.setItem('useDates', useDates.toString())
    localStorage.setItem('moveOutDate', moveOutDate)
    localStorage.setItem('agreementEndDate', agreementEndDate)
    localStorage.setItem('weeksRemaining', weeksRemaining)
    localStorage.setItem('calculatedAdvertisingWeeks', calculatedAdvertisingWeeks?.toString() || '')
    localStorage.setItem('rawMoveOutDate', rawMoveOutDate)
    localStorage.setItem('rawEndDate', rawEndDate)
    localStorage.setItem('relettingRent', relettingRent)
    localStorage.setItem('lettingFeeWeeks', lettingFeeWeeks)
    localStorage.setItem('relettingFee', JSON.stringify(relettingFee))
    localStorage.setItem('useDatesReletting', useDatesReletting.toString())
    localStorage.setItem('relettingMoveOutDate', relettingMoveOutDate)
    localStorage.setItem('relettingEndDate', relettingEndDate)
    localStorage.setItem('relettingWeeksRemaining', relettingWeeksRemaining)
    localStorage.setItem('calculatedRelettingWeeks', calculatedRelettingWeeks?.toString() || '')
  }, [
    activeTab, weeklyRent, rentResults, term, advertisingCost, advertisingFee,
    useDates, moveOutDate, agreementEndDate, weeksRemaining, calculatedAdvertisingWeeks,
    rawMoveOutDate, rawEndDate, relettingRent, lettingFeeWeeks, relettingFee, useDatesReletting,
    relettingMoveOutDate, relettingEndDate, relettingWeeksRemaining, calculatedRelettingWeeks
  ])

  // Set light theme on body
  useEffect(() => {
    document.body.setAttribute('data-theme', 'light')
  }, [])

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2
    })
  }

  const calculateRent = (e: React.FormEvent) => {
    e.preventDefault()
    setRentError('')
    
    if (!weeklyRent || isNaN(Number(weeklyRent)) || Number(weeklyRent) <= 0) {
      setRentError('Please enter a valid weekly rent amount')
      return
    }

    const rentAmount = Number(weeklyRent)
    const advance = rentAmount * 2
    const bond = rentAmount <= 800 ? rentAmount * 4 : rentAmount * 6
    const total = advance + bond

    setRentResults({
      advance,
      bond,
      total
    })
  }

  const handleCalculateAdvertising = (e: React.FormEvent) => {
    e.preventDefault()
    setAdvertisingError('')
    setDateError(null)
    setAdvertisingFee(null)
    setCalculatedAdvertisingWeeks(null)

    // Validate advertising cost
    const adCost = parseFloat(advertisingCost)
    if (isNaN(adCost) || adCost <= 0) {
      setAdvertisingError('Please enter a valid advertising cost amount')
      return
    }

    // Calculate and validate remaining weeks
    let remainingWeeks = 0

    if (useDates) {
      // Try to parse the dates
      let moveOutDateObj = null
      let endDateObj = null

      if (rawMoveOutDate) {
        moveOutDateObj = parse(rawMoveOutDate, 'dd/MM/yyyy', new Date())
        if (!isValid(moveOutDateObj)) {
          moveOutDateObj = new Date(moveOutDate)
        }
      }
      if (rawEndDate) {
        endDateObj = parse(rawEndDate, 'dd/MM/yyyy', new Date())
        if (!isValid(endDateObj)) {
          endDateObj = new Date(agreementEndDate)
        }
      }

      if (!moveOutDateObj || !endDateObj) {
        setDateError('Please enter valid dates in DD/MM/YYYY format')
        setAdvertisingError('Please enter valid dates')
        return
      }

      const weeksResult = calculateWeeksRemaining(moveOutDateObj, endDateObj)
      if (weeksResult.error || weeksResult.weeks === null) {
        setDateError(weeksResult.error)
        setAdvertisingError(weeksResult.error || 'Error calculating weeks')
        return
      }
      remainingWeeks = weeksResult.weeks
    } else {
      remainingWeeks = parseFloat(weeksRemaining)
    }

    if (isNaN(remainingWeeks) || remainingWeeks <= 0) {
      setAdvertisingError('Remaining weeks must be greater than 0')
      return
    }

    // Validate term
    if (!term || term <= 0) {
      setAdvertisingError('Please select a valid term')
      return
    }

    try {
      // Apply official formula
      const threeQuartersOfTermWeeks = Math.round(term * 0.75)
      const fee = (adCost * remainingWeeks) / threeQuartersOfTermWeeks

      setCalculatedAdvertisingWeeks(remainingWeeks)
      setAdvertisingFee(Math.round(fee * 100) / 100)
    } catch (error) {
      console.error('Calculation error:', error)
      setAdvertisingError('An error occurred during calculation')
    }
  }

  const handleCalculateReletting = (e: React.FormEvent) => {
    e.preventDefault()
    setRelettingError('')
    setDateError(null)
    setRelettingFee(null)
    setCalculatedRelettingWeeks(null)

    // Validate base weekly rent
    const baseRent = parseFloat(relettingRent)
    if (isNaN(baseRent) || baseRent <= 0) {
      setRelettingError('Please enter a valid weekly rent amount')
      return
    }

    // Validate letting fee weeks
    const lettingFee = parseFloat(lettingFeeWeeks)
    if (isNaN(lettingFee) || lettingFee <= 0 || lettingFee > 2) {
      setRelettingError('Letting fee must be between 0 and 2')
      return
    }

    // Calculate and validate remaining weeks
    let remainingWeeks = 0
    if (useDatesReletting) {
      // Parse the dates
      let moveOutDateObj = null
      let endDateObj = null

      if (rawMoveOutDate) {
        moveOutDateObj = parse(rawMoveOutDate, 'dd/MM/yyyy', new Date())
        if (!isValid(moveOutDateObj)) {
          moveOutDateObj = new Date(relettingMoveOutDate)
        }
      }
      if (rawEndDate) {
        endDateObj = parse(rawEndDate, 'dd/MM/yyyy', new Date())
        if (!isValid(endDateObj)) {
          endDateObj = new Date(relettingEndDate)
        }
      }

      if (!moveOutDateObj || !endDateObj) {
        setDateError('Please enter valid dates in DD/MM/YYYY format')
        setRelettingError('Please enter valid dates')
        return
      }

      const weeksResult = calculateWeeksRemaining(moveOutDateObj, endDateObj)
      if (weeksResult.error || weeksResult.weeks === null) {
        setDateError(weeksResult.error)
        setRelettingError(weeksResult.error || 'Error calculating weeks')
        return
      }
      remainingWeeks = weeksResult.weeks
    } else {
      remainingWeeks = parseFloat(relettingWeeksRemaining)
    }

    if (isNaN(remainingWeeks) || remainingWeeks <= 0) {
      setRelettingError('Remaining weeks must be greater than 0')
      return
    }

    // Validate term
    if (!term || term <= 0) {
      setRelettingError('Please select a valid term')
      return
    }

    try {
      // Calculate GST inclusive weekly rent (10% GST)
      const weeklyRentWithGST = baseRent * 1.1

      // Calculate letting fee weeks rent with GST
      const lettingFeeRentWithGST = weeklyRentWithGST * lettingFee

      // Calculate three quarters term
      const threeQuartersTerm = Math.round(term * 0.75)

      // Calculate the reletting fee
      const relettingFeeAmount = (lettingFeeRentWithGST * remainingWeeks) / threeQuartersTerm

      setCalculatedRelettingWeeks(remainingWeeks)
      setRelettingFee({
        weeklyRentWithGST: Math.round(weeklyRentWithGST * 100) / 100,
        maximumRelettingFee: Math.round(relettingFeeAmount * 100) / 100
      })
    } catch (error) {
      console.error('Calculation error:', error)
      setRelettingError('An error occurred during calculation')
    }
  }

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'rent' ? 'active' : ''}`}
          onClick={() => setActiveTab('rent')}
        >
          Rent
        </button>
        <button
          className={`tab ${activeTab === 'advertising' ? 'active' : ''}`}
          onClick={() => setActiveTab('advertising')}
        >
          Advertising
        </button>
        <button
          className={`tab ${activeTab === 'reletting' ? 'active' : ''}`}
          onClick={() => setActiveTab('reletting')}
        >
          Reletting
        </button>
      </div>

      {activeTab === 'rent' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Rent Calculator</h2>
            <p className="card-description">
              Calculate your move-in costs including bond and rent in advance
            </p>
          </div>
          
          <form onSubmit={calculateRent}>
            <div className="form-group">
              <label className="label" htmlFor="weeklyRent">
                Weekly Rent Amount
              </label>
              <input
                id="weeklyRent"
                className="input"
                type="number"
                placeholder="Enter amount in AUD"
                value={weeklyRent}
                onChange={(e) => setWeeklyRent(e.target.value)}
              />
            </div>

            {rentError && (
              <div className="error">
                {rentError}
              </div>
            )}

            {rentResults.advance !== null && 
             rentResults.bond !== null && 
             rentResults.total !== null && (
              <div className="results">
                <div className="result-item">
                  <span className="result-label">Two Weeks Advance</span>
                  <span>{formatCurrency(rentResults.advance)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Bond Amount</span>
                  <span>{formatCurrency(rentResults.bond)}</span>
                </div>
                <div className="result-item total">
                  <span>Total Move-in Cost</span>
                  <span>{formatCurrency(rentResults.total)}</span>
                </div>
              </div>
            )}

            <button type="submit" className="button">
              Calculate Costs
            </button>
          </form>
        </div>
      )}

      {activeTab === 'advertising' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Advertising Fee Calculator</h2>
            <p className="card-description">
              Calculate the advertising fee based on remaining term
            </p>
          </div>
          
          <form onSubmit={handleCalculateAdvertising}>
            <div className="form-group">
              <label className="label">Advertising Cost</label>
              <input
                className="input"
                type="number"
                placeholder="Enter advertising cost"
                value={advertisingCost}
                onChange={(e) => setAdvertisingCost(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Agreed Term</label>
              <select 
                className="select"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
              >
                {TERM_OPTIONS.map((option) => (
                  <option key={option.weeks} value={option.weeks}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="switch-container">
              <div 
                className={`switch ${useDates ? 'active' : ''}`}
                onClick={() => setUseDates(!useDates)}
              />
              <label className="label" style={{ margin: 0 }}>Use dates instead of weeks</label>
            </div>

            {useDates ? (
              <>
                <div className="form-group">
                  <label className="label">Move Out Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={moveOutDate}
                    onChange={(e) => {
                      setMoveOutDate(e.target.value)
                      setRawMoveOutDate(e.target.value)
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="label">Agreement End Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={agreementEndDate}
                    onChange={(e) => {
                      setAgreementEndDate(e.target.value)
                      setRawEndDate(e.target.value)
                    }}
                  />
                </div>
                {dateError && (
                  <div className="error">
                    {dateError}
                  </div>
                )}
                {moveOutDate && agreementEndDate && !dateError && (
                  <div className="info-box">
                    <span>Calculated weeks remaining: </span>
                    <span className="font-medium">
                      {calculateWeeksRemaining(new Date(moveOutDate), new Date(agreementEndDate)).weeks ?? 0}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="form-group">
                <label className="label">Weeks Remaining</label>
                <input
                  className="input"
                  type="number"
                  placeholder="Enter number of weeks"
                  value={weeksRemaining}
                  onChange={(e) => setWeeksRemaining(e.target.value)}
                />
              </div>
            )}

            {advertisingError && (
              <div className="error">
                {advertisingError}
              </div>
            )}

            {advertisingFee !== null && calculatedAdvertisingWeeks !== null && (
              <div className="results">
                <div className="result-item">
                  <span className="result-label">Weeks Calculated</span>
                  <span>{calculatedAdvertisingWeeks}</span>
                </div>
                <div className="result-item total">
                  <span>Advertising Fee</span>
                  <span>{formatCurrency(advertisingFee)}</span>
                </div>
              </div>
            )}

            <button type="submit" className="button">
              Calculate Fee
            </button>
          </form>
        </div>
      )}

      {activeTab === 'reletting' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Reletting Fee Calculator</h2>
            <p className="card-description">
              Calculate the maximum reletting fee based on remaining term
            </p>
          </div>
          
          <form onSubmit={handleCalculateReletting}>
            <div className="form-group">
              <label className="label">Base Weekly Rent (excl. GST)</label>
              <input
                className="input"
                type="number"
                placeholder="Enter base weekly rent"
                value={relettingRent}
                onChange={(e) => setRelettingRent(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Letting Fee (in weeks, max 2)</label>
              <input
                className="input"
                type="number"
                step="0.1"
                min="0"
                max="2"
                placeholder="e.g., 1.1, 1.5, 2"
                value={lettingFeeWeeks}
                onChange={(e) => setLettingFeeWeeks(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Agreed Term</label>
              <select 
                className="select"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
              >
                {TERM_OPTIONS.map((option) => (
                  <option key={option.weeks} value={option.weeks}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="switch-container">
              <div 
                className={`switch ${useDatesReletting ? 'active' : ''}`}
                onClick={() => setUseDatesReletting(!useDatesReletting)}
              />
              <label className="label" style={{ margin: 0 }}>Use dates instead of weeks</label>
            </div>

            {useDatesReletting ? (
              <>
                <div className="form-group">
                  <label className="label">Move Out Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={relettingMoveOutDate}
                    onChange={(e) => {
                      setRelettingMoveOutDate(e.target.value)
                      setRawMoveOutDate(e.target.value)
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="label">Agreement End Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={relettingEndDate}
                    onChange={(e) => {
                      setRelettingEndDate(e.target.value)
                      setRawEndDate(e.target.value)
                    }}
                  />
                </div>
                {dateError && (
                  <div className="error">
                    {dateError}
                  </div>
                )}
                {relettingMoveOutDate && relettingEndDate && !dateError && (
                  <div className="info-box">
                    <span>Calculated weeks remaining: </span>
                    <span className="font-medium">
                      {calculateWeeksRemaining(new Date(relettingMoveOutDate), new Date(relettingEndDate)).weeks ?? 0}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="form-group">
                <label className="label">Weeks Remaining</label>
                <input
                  className="input"
                  type="number"
                  placeholder="Enter number of weeks"
                  value={relettingWeeksRemaining}
                  onChange={(e) => setRelettingWeeksRemaining(e.target.value)}
                />
              </div>
            )}

            {relettingError && (
              <div className="error">
                {relettingError}
              </div>
            )}

            {relettingFee !== null && calculatedRelettingWeeks !== null && (
              <div className="results">
                <div className="result-item">
                  <span className="result-label">Weekly Rent (incl. GST)</span>
                  <span>{formatCurrency(relettingFee.weeklyRentWithGST)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Weeks Calculated</span>
                  <span>{calculatedRelettingWeeks}</span>
                </div>
                <div className="result-item total">
                  <span>Maximum Reletting Fee</span>
                  <span>{formatCurrency(relettingFee.maximumRelettingFee)}</span>
                </div>
              </div>
            )}

            <button type="submit" className="button">
              Calculate Fee
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
