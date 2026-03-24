'use client'

import { useState } from 'react'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [current, setCurrent] = useState(3)
  const [goalType, setGoalType] = useState('reduce')
  const [goalAmount, setGoalAmount] = useState(1)
  const [weeks, setWeeks] = useState(8)

  const handleStep1Next = () => {
    if (current === 1) setGoalType('quit')
    if (goalAmount >= current) setGoalAmount(Math.max(1, current - 1))
    setStep(2)
  }

  const handleSubmit = () => {
    onComplete({
      current,
      goal: goalType === 'quit' ? 0 : goalAmount,
      goalType,
      weeks,
      startDate: new Date().toISOString().split('T')[0],
    })
  }

  const canSubmit =
    goalType === 'quit' ||
    (goalType === 'reduce' && goalAmount >= 1 && goalAmount < current)

  return (
    <div className="onboarding">
      <div className="onboarding-logo">
        <span className="onboarding-leaf">🌿</span>
        <h1 className="onboarding-title">Leafwise</h1>
        <p className="onboarding-tagline">Take back control, one day at a time.</p>
      </div>

      <div className="onboarding-card">
        {step === 1 && (
          <Step1
            current={current}
            setCurrent={setCurrent}
            onNext={handleStep1Next}
          />
        )}
        {step === 2 && (
          <Step2
            current={current}
            goalType={goalType}
            setGoalType={setGoalType}
            goalAmount={goalAmount}
            setGoalAmount={setGoalAmount}
            weeks={weeks}
            setWeeks={setWeeks}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
          />
        )}
      </div>
    </div>
  )
}

function Step1({ current, setCurrent, onNext }) {
  return (
    <>
      <p className="onboarding-step-label">Step 1 of 2</p>
      <h2 className="onboarding-heading">How much do you currently smoke?</h2>
      <p className="onboarding-sub">
        No judgment here — this is just your starting point. Be honest with yourself.
      </p>

      <div className="number-input-wrap">
        <button
          className="number-btn"
          onClick={() => setCurrent(v => Math.max(1, v - 1))}
          disabled={current <= 1}
          aria-label="Decrease"
        >
          −
        </button>
        <div>
          <div className="number-display">{current}</div>
          <div className="number-unit">joints / day</div>
        </div>
        <button
          className="number-btn"
          onClick={() => setCurrent(v => Math.min(30, v + 1))}
          disabled={current >= 30}
          aria-label="Increase"
        >
          +
        </button>
      </div>

      <button className="btn-primary" onClick={onNext}>
        Continue →
      </button>
    </>
  )
}

function Step2({
  current,
  goalType, setGoalType,
  goalAmount, setGoalAmount,
  weeks, setWeeks,
  canSubmit, onSubmit, onBack,
}) {
  return (
    <>
      <p className="onboarding-step-label">Step 2 of 2</p>
      <h2 className="onboarding-heading">What&apos;s your goal?</h2>
      <p className="onboarding-sub">
        Both paths are valid and worthy. Choose what feels right for you right now.
      </p>

      <div className="goal-toggle">
        <button
          className={`goal-toggle-btn${goalType === 'reduce' ? ' active' : ''}`}
          onClick={() => setGoalType('reduce')}
          disabled={current === 1}
          title={current === 1 ? 'Already at 1/day — quitting is the only path forward' : undefined}
        >
          ✂️ Reduce
        </button>
        <button
          className={`goal-toggle-btn${goalType === 'quit' ? ' active' : ''}`}
          onClick={() => setGoalType('quit')}
        >
          🚫 Quit
        </button>
      </div>
      {current === 1 && (
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: -16, marginBottom: 8 }}>
          You&apos;re already at 1/day — quitting is your path forward. You&apos;ve got this.
        </p>
      )}

      {goalType === 'reduce' && (
        <div style={{ marginBottom: 24 }}>
          <p className="onboarding-sub" style={{ marginBottom: 12 }}>
            Target: how many joints per day?
          </p>
          <div className="number-input-wrap" style={{ marginBottom: 0 }}>
            <button
              className="number-btn"
              onClick={() => setGoalAmount(v => Math.max(1, v - 1))}
              disabled={goalAmount <= 1}
              aria-label="Decrease"
            >
              −
            </button>
            <div>
              <div className="number-display" style={{ fontSize: 42 }}>{goalAmount}</div>
              <div className="number-unit">joints / day</div>
            </div>
            <button
              className="number-btn"
              onClick={() => setGoalAmount(v => Math.min(current - 1, v + 1))}
              disabled={goalAmount >= current - 1}
              aria-label="Increase"
            >
              +
            </button>
          </div>
          {goalAmount >= current && (
            <p style={{ fontSize: 12, color: 'var(--error)', textAlign: 'center', marginTop: 8 }}>
              Target must be lower than your current use ({current}/day)
            </p>
          )}
        </div>
      )}

      <p className="timeframe-label">Timeframe</p>
      <div className="timeframe-grid">
        {[4, 6, 8, 12].map(w => (
          <button
            key={w}
            className={`timeframe-btn${weeks === w ? ' active' : ''}`}
            onClick={() => setWeeks(w)}
          >
            {w}w
          </button>
        ))}
      </div>

      <button
        className="btn-primary"
        onClick={onSubmit}
        disabled={!canSubmit}
      >
        Generate My Plan 🌱
      </button>

      <button className="btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={onBack}>
        ← Back
      </button>
    </>
  )
}
