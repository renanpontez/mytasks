'use client'

import { useState, useEffect, useCallback } from 'react'

function renderPlanText(text) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) {
      i++
      continue
    }

    // H2 — ## heading
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{line.slice(3).replace(/\*\*/g, '')}</h2>)
      i++
      continue
    }

    // H3 — ### heading or **Bold heading:**
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{line.slice(4).replace(/\*\*/g, '')}</h3>)
      i++
      continue
    }

    // H2-style from **Phase X:**
    if (/^\*\*Phase\s/i.test(line) || /^\*\*Week\s/i.test(line)) {
      elements.push(<h2 key={i}>{line.replace(/\*\*/g, '').replace(/:$/, '')}</h2>)
      i++
      continue
    }

    // Bold standalone line (section header)
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<h3 key={i}>{line.slice(2, -2)}</h3>)
      i++
      continue
    }

    // Bullet list item
    if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      const bullets = []
      while (i < lines.length) {
        const l = lines[i].trim()
        if (l.startsWith('- ') || l.startsWith('• ') || l.startsWith('* ')) {
          bullets.push(<li key={i}>{parseBold(l.slice(2))}</li>)
          i++
        } else {
          break
        }
      }
      elements.push(<ul key={`ul-${i}`}>{bullets}</ul>)
      continue
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length) {
        const l = lines[i].trim()
        if (/^\d+\.\s/.test(l)) {
          items.push(<li key={i}>{parseBold(l.replace(/^\d+\.\s/, ''))}</li>)
          i++
        } else {
          break
        }
      }
      elements.push(<ul key={`ol-${i}`}>{items}</ul>)
      continue
    }

    // Regular paragraph
    elements.push(<p key={i}>{parseBold(line)}</p>)
    i++
  }

  return elements
}

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

export default function PlanTab({ profile }) {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPlan = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current: profile.current,
          goal: profile.goal,
          goalType: profile.goalType,
          weeks: profile.weeks,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to generate plan')
      setPlan(data.plan)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [profile])

  useEffect(() => {
    fetchPlan()
  }, [fetchPlan])

  const goalLabel =
    profile.goalType === 'quit'
      ? '0 joints/day (quit)'
      : `${profile.goal} joint${profile.goal !== 1 ? 's' : ''}/day`

  return (
    <div className="page">
      {/* Header */}
      <div className="plan-header">
        <h2 className="plan-header-title">Your Reduction Plan</h2>
        <p className="plan-header-sub">
          From {profile.current}/day → {goalLabel} over {profile.weeks} weeks
        </p>
      </div>

      {/* Plan Content */}
      <div className="plan-content">
        {loading && (
          <div className="plan-loading">
            <div className="spinner" />
            <span>Building your personalized plan…</span>
          </div>
        )}

        {!loading && error && (
          <div className="plan-error">
            <p style={{ marginBottom: 16 }}>Unable to generate your plan. {error}</p>
            <button className="btn-secondary" onClick={fetchPlan}>
              Try again
            </button>
          </div>
        )}

        {!loading && plan && (
          <div className="plan-text">
            {renderPlanText(plan)}
          </div>
        )}
      </div>

      {/* Regenerate */}
      {!loading && (
        <button className="btn-secondary" onClick={fetchPlan} style={{ alignSelf: 'center' }}>
          🔄 Regenerate plan
        </button>
      )}

      {/* Disclaimer */}
      <div className="plan-disclaimer">
        ⚕️ This plan uses evidence-based harm reduction strategies. For severe withdrawal symptoms — including prolonged anxiety, insomnia, or depression — please consult a healthcare provider.
      </div>
    </div>
  )
}
