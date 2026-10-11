import React from 'react';
import { User, Swords, ShieldAlert, Clock, Users, Award, BookOpen, Settings } from 'lucide-react';
import { useSystem } from '../../context/SystemContext.jsx';

export default function SystemNav({ activeTab, setActiveTab }) {
  const { state } = useSystem();
  const pendingQuestsCount = state.quests.filter(q => !q.completed).length;
  const statPointsAvailable = state.player.statPoints;

  const NAV_ITEMS = [
    { id: 'status', label: 'STATUS', icon: User, badge: statPointsAvailable > 0 ? `+${statPointsAvailable}` : null },
    { id: 'quests', label: 'QUESTS', icon: Swords, badge: pendingQuestsCount > 0 ? pendingQuestsCount : null },
    { id: 'dungeons', label: 'DUNGEONS', icon: ShieldAlert },
    { id: 'focus', label: 'FOCUS SANCTUM', icon: Clock },
    { id: 'shadows', label: 'SHADOWS', icon: Users },
    { id: 'achievements', label: 'ACHIEVEMENTS', icon: Award },
    { id: 'history', label: 'CHRONICLES', icon: BookOpen },
    { id: 'settings', label: 'SYSTEM', icon: Settings }
  ];

  return (
    <nav style={{ margin: '18px 0 24px', borderBottom: '1px solid rgba(99, 102, 241, 0.25)', paddingBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="btn-system font-system"
              style={{
                fontSize: 12,
                padding: '9px 14px',
                whiteSpace: 'nowrap',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.4), rgba(124, 58, 237, 0.3))' 
                  : 'rgba(15, 23, 42, 0.5)',
                borderColor: isActive ? 'var(--color-system-blue)' : 'rgba(99, 102, 241, 0.25)',
                color: isActive ? '#38bdf8' : '#94a3b8',
                boxShadow: isActive ? '0 0 14px rgba(56, 189, 248, 0.3)' : 'none'
              }}
            >
              <Icon size={15} color={isActive ? '#38bdf8' : '#94a3b8'} />
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: 'rgba(234, 179, 8, 0.2)',
                  border: '1px solid #facc15',
                  color: '#fef08a',
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 999,
                  marginLeft: 2
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
