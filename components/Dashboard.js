'use client'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatTime(timestamp) {
  const d = new Date(timestamp)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function getLast7Days(today) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export default function Dashboard({ profile, checkIns, todayCount, dailyGoal, today, onLogSmoke }) {
  const last7 = getLast7Days(today)
  const maxBarVal = Math.max(profile.current, ...last7.map(d => checkIns[d]?.length || 0), 1)

  // Progress bar: 0–100%, capped at 200% visually
  const pct = dailyGoal === 0
    ? (todayCount === 0 ? 100 : 0)
    : Math.min((todayCount / dailyGoal) * 100, 100)
  const isOver = dailyGoal > 0 && todayCount > dailyGoal
  const isZeroGoal = dailyGoal === 0

  const goalLineBottom = dailyGoal === 0 ? 0 : (dailyGoal / maxBarVal) * 80 // 80px chart height

  const todayEntries = checkIns[today] || []

  return (
    <div className="page">
      {/* Status Card */}
      <div className="today-card">
        <div className="today-count-wrap">
          <span className="today-count" style={{ color: isOver ? 'var(--error)' : 'var(--accent)' }}>
            {todayCount}
          </span>
          <span className="today-goal-label">
            / {isZeroGoal ? '0' : dailyGoal} today
          </span>
        </div>

        <p className={`today-status${isOver ? ' over' : ' on-track'}`}>
          {isZeroGoal
            ? todayCount === 0
              ? '✨ Zero day achieved!'
              : `⚠️ ${todayCount} above zero goal`
            : isOver
            ? `⚠️ ${todayCount - dailyGoal} above today's target`
            : todayCount === dailyGoal
            ? '✨ Goal achieved today!'
            : `${dailyGoal - todayCount} remaining for today's goal`}
        </p>

        <div className="progress-wrap">
          <div
            className={`progress-fill ${isOver ? 'red' : 'green'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Log Smoke CTA */}
      <button className="log-smoke-btn" onClick={onLogSmoke}>
        🌿 Log a smoke
      </button>

      {/* 7-Day Mini Chart */}
      <div className="chart-wrap">
        <p className="chart-title">Last 7 Days</p>
        <div className="chart-bars" style={{ height: 80 }}>
          {/* Goal dotted line */}
          {dailyGoal > 0 && maxBarVal > 0 && (
            <div
              className="chart-goal-line"
              style={{ bottom: `${(dailyGoal / maxBarVal) * 80}px` }}
            />
          )}
          {last7.map((dateStr, i) => {
            const count = checkIns[dateStr]?.length || 0
            const isToday = dateStr === today
            const hasData = !!checkIns[dateStr]
            const barHeight = maxBarVal > 0 ? Math.max((count / maxBarVal) * 72, count > 0 ? 4 : 0) : 0
            const isOverDay = dailyGoal > 0 && count > dailyGoal
            const dayOfWeek = new Date(dateStr).getDay()
            const label = DAY_LABELS[dayOfWeek]

            let barClass = 'chart-bar empty'
            if (hasData || isToday) {
              if (isToday) barClass = 'chart-bar today'
              else if (isOverDay) barClass = 'chart-bar red'
              else barClass = 'chart-bar green'
            }

            return (
              <div key={dateStr} className="chart-col">
                <span className="chart-bar-count">{(hasData || isToday) && count > 0 ? count : ''}</span>
                <div
                  className={barClass}
                  style={{ height: barHeight > 0 ? barHeight : 3 }}
                />
                <span className={`chart-day-label${isToday ? ' today-label' : ''}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Sessions */}
      <div className="sessions-wrap">
        <div className="sessions-header">Today&apos;s sessions</div>
        {todayEntries.length === 0 ? (
          <div className="session-empty">No sessions logged yet today.</div>
        ) : (
          [...todayEntries].reverse().map(entry => (
            <div key={entry.id} className="session-item">
              <span className="session-time">{formatTime(entry.timestamp)}</span>
              <span className="session-mood" title={entry.mood}>{entry.mood.split(' ')[0]}</span>
              <div className="session-symptoms">
                {entry.symptoms.length === 0 ? (
                  <span className="symptom-chip">No symptoms</span>
                ) : (
                  entry.symptoms.map(s => (
                    <span key={s} className="symptom-chip">{s}</span>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Withdrawal Awareness */}
      <div className="awareness-chip">
        <span className="awareness-icon">🧠</span>
        <p className="awareness-text">
          Symptoms peak at <strong>days 2–6</strong> of any reduction. Irritability, insomnia, and anxiety are normal — they ease within 2–3 weeks.
        </p>
      </div>
    </div>
  )
}
