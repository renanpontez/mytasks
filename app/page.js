'use client'

import { useState } from 'react'
import Onboarding from '@/components/Onboarding'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import CheckInModal from '@/components/CheckInModal'
import PlanTab from '@/components/PlanTab'
import HistoryTab from '@/components/HistoryTab'

function getDailyGoal(profile) {
  if (!profile) return 0
  const { current, goal, weeks, startDate } = profile
  if (current === goal) return goal
  const start = new Date(startDate)
  const now = new Date()
  const daysSinceStart = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)))
  const totalDays = weeks * 7
  // Linear taper from current → goal over the journey
  const progress = Math.min(daysSinceStart / totalDays, 1)
  const target = current - Math.round((current - goal) * progress)
  return Math.max(target, goal)
}

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [checkIns, setCheckIns] = useState({})
  const [activeTab, setActiveTab] = useState('today')
  const [showCheckIn, setShowCheckIn] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const handleOnboardingComplete = (profileData) => {
    setProfile(profileData)
    setActiveTab('today')
  }

  const handleCheckIn = ({ mood, symptoms }) => {
    setCheckIns(prev => ({
      ...prev,
      [today]: [
        ...(prev[today] || []),
        {
          id: Date.now(),
          timestamp: Date.now(),
          mood,
          symptoms,
        },
      ],
    }))
    setShowCheckIn(false)
  }

  const handleReset = () => {
    setProfile(null)
    setCheckIns({})
    setActiveTab('today')
  }

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  const todayCount = checkIns[today]?.length || 0
  const dailyGoal = getDailyGoal(profile)

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content" role="main">
        {activeTab === 'today' && (
          <Dashboard
            key="today"
            profile={profile}
            checkIns={checkIns}
            todayCount={todayCount}
            dailyGoal={dailyGoal}
            today={today}
            onLogSmoke={() => setShowCheckIn(true)}
          />
        )}
        {activeTab === 'plan' && (
          <PlanTab key="plan" profile={profile} />
        )}
        {activeTab === 'history' && (
          <HistoryTab
            key="history"
            profile={profile}
            checkIns={checkIns}
            dailyGoal={dailyGoal}
            today={today}
            onReset={handleReset}
          />
        )}
      </main>

      {showCheckIn && (
        <CheckInModal
          onConfirm={handleCheckIn}
          onClose={() => setShowCheckIn(false)}
        />
      )}
    </div>
  )
}
