import React, { useState } from 'react'
import '../styles/styles.css'

interface CalculationResult {
  advance: number
  bond: number
  total: number
}

export function Calculator() {
  const [activeTab, setActiveTab] = useState('rent')
  const [weeklyRent, setWeeklyRent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CalculationResult | null>(null)

  const calculateRent = (e: React.FormEvent) => {
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

  const calculateAdvertising = (e: React.FormEvent) => {
    e.preventDefault()
    const rentAmount = parseFloat(weeklyRent)
    
    if (isNaN(rentAmount) || rentAmount <= 0) {
      setError("Please enter a valid rent amount")
      setResult(null)
      return
    }

    const fee = rentAmount * 0.1 // 10% fee
    setResult({ advance: 0, bond: fee, total: fee })
    setError(null)
  }

  const calculateReletting = (e: React.FormEvent) => {
    e.preventDefault()
    const rentAmount = parseFloat(weeklyRent)
    
    if (isNaN(rentAmount) || rentAmount <= 0) {
      setError("Please enter a valid rent amount")
      setResult(null)
      return
    }

    const fee = rentAmount * 0.15 // 15% fee
    setResult({ advance: 0, bond: fee, total: fee })
    setError(null)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Lease Calculator</h2>
          <p className="card-description">
            Calculate rent in advance, bond, and other fees
          </p>
        </div>
        <div className="card-content">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'rent' ? 'active' : ''}`}
              onClick={() => setActiveTab('rent')}
            >
              Rent Calculator
            </button>
            <button
              className={`tab ${activeTab === 'advertising' ? 'active' : ''}`}
              onClick={() => setActiveTab('advertising')}
            >
              Advertising Fee
            </button>
            <button
              className={`tab ${activeTab === 'reletting' ? 'active' : ''}`}
              onClick={() => setActiveTab('reletting')}
            >
              Reletting Fee
            </button>
          </div>

          <form onSubmit={
            activeTab === 'rent' ? calculateRent :
            activeTab === 'advertising' ? calculateAdvertising :
            calculateReletting
          }>
            <div className="form-group">
              <label className="label">
                {activeTab === 'rent' ? 'Weekly Rent Amount ($)' : 'Rent Amount ($)'}
              </label>
              <input
                type="number"
                className="input"
                placeholder="Enter amount"
                value={weeklyRent}
                onChange={(e) => setWeeklyRent(e.target.value)}
              />
            </div>

            {error && <div className="error">{error}</div>}

            {result && (
              <div className="result">
                {activeTab === 'rent' ? (
                  <>
                    <div className="result-item">
                      <span className="result-label">Two Weeks Advance:</span>
                      <span className="result-value">${result.advance.toFixed(2)}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Bond Amount:</span>
                      <span className="result-value">${result.bond.toFixed(2)}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Total Move-in Cost:</span>
                      <span className="result-value">${result.total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="result-item">
                    <span className="result-label">
                      {activeTab === 'advertising' ? 'Advertising Fee' : 'Reletting Fee'}:
                    </span>
                    <span className="result-value">${result.total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="button">
              Calculate
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
