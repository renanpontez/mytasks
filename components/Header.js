'use client'

export default function Header({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'today', label: '🏠 Today' },
    { id: 'plan',  label: '📋 My Plan' },
    { id: 'history', label: '📊 History' },
  ]

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-brand-leaf">🌿</span>
        <span className="header-brand-name">Leafwise</span>
      </div>
      <nav className="tab-nav" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
