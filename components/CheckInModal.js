'use client'

import { useState } from 'react'

const MOODS = [
  { emoji: '😊', label: 'Great' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😔', label: 'Rough' },
]

const SYMPTOMS = [
  { emoji: '😴', label: 'Sleep issues' },
  { emoji: '😤', label: 'Irritability' },
  { emoji: '😰', label: 'Anxiety' },
  { emoji: '🍽️', label: 'Appetite loss' },
  { emoji: '🤕', label: 'Headache' },
  { emoji: '😩', label: 'Restlessness' },
]

export default function CheckInModal({ onConfirm, onClose }) {
  const [mood, setMood] = useState(null)
  const [symptoms, setSymptoms] = useState([])

  const toggleSymptom = (label) => {
    setSymptoms(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    )
  }

  const handleConfirm = () => {
    if (!mood) return
    onConfirm({
      mood: `${mood.emoji} ${mood.label}`,
      symptoms: symptoms.map(s => {
        const sym = SYMPTOMS.find(x => x.label === s)
        return sym ? `${sym.emoji} ${sym.label}` : s
      }),
    })
  }

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <h2 className="modal-title">How are you feeling?</h2>

        <p className="modal-section-label">Mood</p>
        <div className="mood-grid">
          {MOODS.map(m => (
            <button
              key={m.label}
              className={`mood-btn${mood?.label === m.label ? ' active' : ''}`}
              onClick={() => setMood(m)}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-label">{m.label}</span>
            </button>
          ))}
        </div>

        <p className="modal-section-label">Symptoms <span style={{ color: 'var(--text-faint)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></p>
        <div className="symptom-grid">
          {SYMPTOMS.map(s => (
            <button
              key={s.label}
              className={`symptom-btn${symptoms.includes(s.label) ? ' active' : ''}`}
              onClick={() => toggleSymptom(s.label)}
            >
              <span className="symptom-emoji">{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={!mood}
        >
          Confirm Check-in ✓
        </button>
      </div>
    </div>
  )
}
