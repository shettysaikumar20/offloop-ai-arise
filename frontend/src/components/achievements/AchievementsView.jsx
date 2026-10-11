import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { Award, Trophy, Sparkles, Shield, Flame, Zap, Clock, Skull, CheckCircle2 } from 'lucide-react';

export default function AchievementsView() {
  const { state } = useSystem();
  const [filterCat, setFilterCat] = useState('all');

  const achievements = state.achievements || [];

  const filteredAchs = achievements.filter(a => {
    if (filterCat === 'all') return true;
    return a.category === filterCat;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div>
      {/* Banner */}
      <div className="system-panel corner-brackets" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Trophy size={22} color="#facc15" />
              <h2 className="font-system" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                HUNTER ACHIEVEMENTS & FEATS
              </h2>
            </div>
            <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Permanent accolades granted by the System for transcendent consistency and mastery.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.3)', padding: '6px 14px', borderRadius: 4 }}>
            <Award size={16} color="#facc15" />
            <span className="font-system" style={{ fontSize: 13, color: '#fef08a' }}>
              {unlockedCount} / {achievements.length} FEATS UNLOCKED
            </span>
          </div>
        </div>

        {/* Filter categories */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
          {['all', 'quest', 'streak', 'focus', 'dungeon', 'level'].map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className="btn-system font-sub"
              style={{
                padding: '5px 12px',
                fontSize: 12,
                background: filterCat === c ? 'rgba(99, 102, 241, 0.35)' : 'rgba(15, 23, 42, 0.4)',
                borderColor: filterCat === c ? '#38bdf8' : 'rgba(99, 102, 241, 0.2)',
                color: filterCat === c ? '#38bdf8' : '#94a3b8'
              }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {filteredAchs.map(ach => {
          const isUnlocked = ach.unlocked;
          const progressPercent = Math.min(100, Math.round((ach.current / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className="system-panel corner-brackets"
              style={{
                padding: 18,
                background: isUnlocked ? 'rgba(10, 20, 42, 0.85)' : 'rgba(8, 12, 28, 0.65)',
                borderColor: isUnlocked ? 'rgba(250, 204, 21, 0.4)' : 'rgba(99, 102, 241, 0.2)',
                boxShadow: isUnlocked ? '0 0 16px rgba(250, 204, 21, 0.15)' : 'none',
                opacity: isUnlocked ? 1 : 0.8
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: isUnlocked ? 'rgba(250, 204, 21, 0.15)' : 'rgba(30, 41, 59, 0.5)', border: `1px solid ${isUnlocked ? '#facc15' : '#475569'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trophy size={18} color={isUnlocked ? '#facc15' : '#64748b'} />
                  </div>
                  <div>
                    <h4 className="font-system" style={{ fontSize: 14, fontWeight: 700, color: isUnlocked ? '#f8fafc' : '#cbd5e1', margin: 0 }}>
                      {ach.title}
                    </h4>
                    <span className="font-sub" style={{ fontSize: 11, color: isUnlocked ? '#22c55e' : '#64748b' }}>
                      {isUnlocked ? `COMPLETED (${new Date(ach.unlockedAt).toLocaleDateString()})` : 'IN PROGRESS'}
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-system)',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '2px 6px',
                  borderRadius: 4
                }}>
                  +{ach.rewardXp} XP
                </span>
              </div>

              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 12px', lineHeight: 1.35 }}>
                {ach.description}
              </p>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                  <span>Progress</span>
                  <span className="font-system">{Math.min(ach.target, ach.current)} / {ach.target}</span>
                </div>
                <div className="system-progress-track" style={{ height: 6 }}>
                  <div
                    className="system-progress-fill"
                    style={{
                      width: `${progressPercent}%`,
                      background: isUnlocked ? 'linear-gradient(90deg, #eab308, #facc15)' : undefined
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
