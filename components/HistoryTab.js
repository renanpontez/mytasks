'use client'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getLast7Days(today) {
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days // newest first
}

function getDaysSinceStart(startDate) {
  const start = new Date(startDate)
  const now = new Date()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}

export default function HistoryTab({ profile, checkIns, dailyGoal, today, onReset }) {
  const { current, goal, weeks, startDate } = profile
  const totalDays = weeks * 7
  const daysSinceStart = getDaysSinceStart(startDate)
  const progressPct = Math.min(Math.round((daysSinceStart / totalDays) * 100), 100)

  const todayCount = checkIns[today]?.length || 0
  const last7 = getLast7Days(today)

  const getRowIcon = (count, dateStr, hasData) => {
    if (!hasData) return '—'
    if (count === 0) return '✨'
    if (dailyGoal === 0 && count > 0) return '⚠️'
    if (count <= dailyGoal) return '✅'
    return '⚠️'
  }

  const getCountClass = (count, dateStr, hasData) => {
    if (!hasData) return 'day-count empty'
    if (count === 0) return 'day-count zero'
    if (dailyGoal === 0 || count > dailyGoal) return 'day-count over'
    return 'day-count under'
  }

  const getCountLabel = (count, dateStr, hasData) => {
    if (!hasData) return 'No data'
    if (count === 0) return 'Zero day 🎉'
    return `${count} logged`
  }

  return (
    <div className="page">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Started at</div>
          <div className="stat-value" style={{ color: 'var(--error)' }}>{current}</div>
          <div className="stat-unit">joints/day</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Goal</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{goal}</div>
          <div className="stat-unit">joints/day</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today</div>
          <div
            className="stat-value"
            style={{
              color: todayCount <= dailyGoal ? 'var(--accent-2)' : 'var(--error)',
            }}
          >
            {todayCount}
          </div>
          <div className="stat-unit">logged</div>
        </div>
      </div>

      {/* Journey Progress */}
      <div className="journey-card">
        <div className="journey-header">
          <span className="journey-label">
            Day {Math.max(1, daysSinceStart + 1)} of {totalDays}
          </span>
          <span className="journey-pct">{progressPct}%</span>
        </div>
        <div className="progress-wrap">
          <div
            className="progress-fill green"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>
          {totalDays - daysSinceStart > 0
            ? `${totalDays - daysSinceStart} days remaining in your journey`
            : 'Journey complete — celebrate your progress!'}
        </p>
      </div>

      {/* 7-Day List */}
      <div className="day-list">
        <div className="day-list-header">Last 7 days</div>
        {last7.map((dateStr, i) => {
          const count = checkIns[dateStr]?.length || 0
          const hasData = !!checkIns[dateStr]
          const isToday = dateStr === today
          const d = new Date(dateStr)
          const dayOfWeek = d.getDay()
          const label = isToday
            ? `Today (${DAY_SHORT[dayOfWeek]})`
            : i === 1
            ? `Yesterday`
            : `${DAY_NAMES[dayOfWeek]}`

          return (
            <div key={dateStr} className="day-row">
              <span className="day-icon">{getRowIcon(count, dateStr, hasData)}</span>
              <span className={`day-name${isToday ? ' today-name' : ''}`}>{label}</span>
              <span className={getCountClass(count, dateStr, hasData)}>
                {getCountLabel(count, dateStr, hasData)}
              </span>
              {hasData && (
                <span className="day-goal-badge">goal: {dailyGoal}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Reset */}
      <button className="btn-danger" onClick={onReset}>
        ↺ Reset &amp; start fresh
      </button>
    </div>
  )
}
