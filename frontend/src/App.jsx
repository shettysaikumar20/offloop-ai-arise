import React, { useState } from 'react';
import { SystemProvider } from './context/SystemContext.jsx';
import SystemHeader from './components/common/SystemHeader.jsx';
import SystemNav from './components/common/SystemNav.jsx';
import SystemNotification from './components/common/SystemNotification.jsx';
import LevelUpOverlay from './components/common/LevelUpOverlay.jsx';

import PlayerStatus from './components/status/PlayerStatus.jsx';
import QuestList from './components/quests/QuestList.jsx';
import DungeonList from './components/dungeons/DungeonList.jsx';
import FocusTimer from './components/focus/FocusTimer.jsx';
import ShadowInventory from './components/shadows/ShadowInventory.jsx';
import AchievementsView from './components/achievements/AchievementsView.jsx';
import ActivityHistoryView from './components/history/ActivityHistoryView.jsx';
import SystemSettings from './components/system/SystemSettings.jsx';

function SystemApp() {
  const [activeTab, setActiveTab] = useState('quests');

  return (
    <div className="app-container">
      {/* Top Header */}
      <SystemHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="app-main">
        {/* Navigation Bar */}
        <SystemNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* View Switcher */}
        {activeTab === 'status' && <PlayerStatus />}
        {activeTab === 'quests' && <QuestList />}
        {activeTab === 'dungeons' && <DungeonList />}
        {activeTab === 'focus' && <FocusTimer />}
        {activeTab === 'shadows' && <ShadowInventory />}
        {activeTab === 'achievements' && <AchievementsView />}
        {activeTab === 'history' && <ActivityHistoryView />}
        {activeTab === 'settings' && <SystemSettings />}
      </main>

      {/* Persistent Atmospheric Footer */}
      <footer style={{ borderTop: '1px solid rgba(99, 102, 241, 0.2)', padding: '16px 24px', background: 'rgba(4, 7, 18, 0.95)', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', display: 'inline-block' }}></span>
            <span className="font-system" style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.08em' }}>
              OFFLOOP AI: ARISE // REAL-WORLD PROTOCOL ONLINE
            </span>
          </div>

          <div className="font-sub" style={{ fontSize: 12, color: '#64748b' }}>
            Zero External Tracking • Client-Side LocalStorage • Optimized for Low-Power Desktops
          </div>
        </div>
      </footer>

      {/* Global Overlays & Notifications */}
      <SystemNotification />
      <LevelUpOverlay />
    </div>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <SystemApp />
    </SystemProvider>
  );
}
