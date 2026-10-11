import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { BookOpen, Zap, Swords, Skull, Clock, Info } from 'lucide-react';

export default function ActivityHistoryView() {
  const { state } = useSystem();
  const [filterType, setFilterType] = useState('all');

  const activityLog = state.activityLog || [];

  const filteredLogs = activityLog.filter(l => {
    if (filterType === 'all') return true;
    return l.type === filterType;
  });

  return (
    <div>
      {/* Overview Stats Bar */}
      <div className="system-panel corner-brackets" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BookOpen size={22} color="#38bdf8" />
              <h2 className="font-system" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                HUNTER CHRONICLES & LOGS
              </h2>
            </div>
            <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Every cleared mission, raid victory, and sanctum interval recorded into the eternal system registry.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '6px 14px', borderRadius: 4 }}>
              <div className="font-sub" style={{ fontSize: 10, color: '#94a3b8' }}>TOTAL CLEARED</div>
              <div className="font-system" style={{ fontSize: 16, color: '#38bdf8' }}>{state.player.totalQuestsCompleted}</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '6px 14px', borderRadius: 4 }}>
              <div className="font-sub" style={{ fontSize: 10, color: '#94a3b8' }}>SANCTUM TIME</div>
              <div className="font-system" style={{ fontSize: 16, color: '#a855f7' }}>{state.player.totalFocusMinutes}m</div>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
          {['all', 'quest', 'xp', 'dungeon', 'system'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="btn-system font-sub"
              style={{
                padding: '5px 12px',
                fontSize: 12,
                background: filterType === t ? 'rgba(99, 102, 241, 0.35)' : 'rgba(15, 23, 42, 0.4)',
                borderColor: filterType === t ? '#38bdf8' : 'rgba(99, 102, 241, 0.2)',
                color: filterType === t ? '#38bdf8' : '#94a3b8'
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="system-panel" style={{ padding: '20px 24px' }}>
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
            <p>No activity recorded under this filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredLogs.map(log => {
              let Icon = Info;
              let iconColor = '#94a3b8';

              if (log.type === 'quest') {
                Icon = Swords;
                iconColor = '#10b981';
              } else if (log.type === 'xp') {
                Icon = Zap;
                iconColor = '#38bdf8';
              } else if (log.type === 'dungeon') {
                Icon = Skull;
                iconColor = '#f43f5e';
              }

              return (
                <div
                  key={log.id}
                  style={{
                    background: 'rgba(6, 11, 26, 0.65)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 6,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 14
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(15, 23, 42, 0.8)', border: `1px solid ${iconColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={iconColor} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: '#f8fafc', margin: 0 }}>
                        {log.message}
                      </p>
                      <span className="font-sub" style={{ fontSize: 11, color: '#64748b' }}>
                        Type: {log.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <span className="font-sub" style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
