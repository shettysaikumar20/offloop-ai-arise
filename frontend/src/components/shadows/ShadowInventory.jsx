import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import ShadowDetailModal from './ShadowDetailModal.jsx';
import { Users, Lock, Unlock, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { RANKS } from '../../types/models.js';

export default function ShadowInventory() {
  const { state } = useSystem();
  const [selectedShadow, setSelectedShadow] = useState(null);

  const shadows = state.shadows || [];
  const unlockedCount = shadows.filter(s => s.unlocked).length;

  return (
    <div>
      {/* Intro Banner */}
      <div className="system-panel corner-brackets" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={22} color="#38bdf8" />
              <h2 className="font-system" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                SHADOW COMPANIONS & ECHOES
              </h2>
            </div>
            <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Original manifestations of your past self-discipline. Arise as you conquer higher milestones.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 14px', borderRadius: 4 }}>
            <Sparkles size={16} color="#38bdf8" />
            <span className="font-system" style={{ fontSize: 13, color: '#38bdf8' }}>
              {unlockedCount} / {shadows.length} EXTRACTED
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Shadows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {shadows.map(shadow => {
          const rankInfo = RANKS[shadow.rank] || RANKS.E;
          const isUnlocked = shadow.unlocked;

          return (
            <div
              key={shadow.id}
              onClick={() => setSelectedShadow(shadow)}
              className="system-panel corner-brackets"
              style={{
                padding: 20,
                cursor: 'pointer',
                borderColor: isUnlocked ? 'rgba(56, 189, 248, 0.4)' : 'rgba(99, 102, 241, 0.2)',
                background: isUnlocked ? 'rgba(10, 16, 40, 0.85)' : 'rgba(8, 12, 28, 0.6)',
                opacity: isUnlocked ? 1 : 0.75,
                boxShadow: isUnlocked ? '0 0 20px rgba(56, 189, 248, 0.18)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className={`rank-badge rank-${shadow.rank}`}>
                  {shadow.rank}-RANK
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: isUnlocked ? '#22c55e' : '#64748b', fontSize: 12, fontFamily: 'var(--font-system)' }}>
                  {isUnlocked ? <Unlock size={14} color="#22c55e" /> : <Lock size={14} color="#64748b" />}
                  <span>{isUnlocked ? 'EXTRACTED' : 'DORMANT'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div 
                  className={isUnlocked ? 'shadow-aura-glow' : ''}
                  style={{ width: 48, height: 48, borderRadius: 10, background: isUnlocked ? 'linear-gradient(135deg, #1e1b4b, #312e81)' : 'rgba(15, 23, 42, 0.8)', border: `1px solid ${isUnlocked ? '#38bdf8' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Sparkles size={24} color={isUnlocked ? '#38bdf8' : '#64748b'} />
                </div>
                <div>
                  <h3 className="font-system" style={{ fontSize: 16, fontWeight: 800, color: isUnlocked ? '#f8fafc' : '#94a3b8', margin: 0 }}>
                    {shadow.name}
                  </h3>
                  <div className="font-sub" style={{ fontSize: 13, color: isUnlocked ? '#c084fc' : '#64748b' }}>
                    {shadow.title}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.4 }}>
                {shadow.description}
              </p>

              {/* Perk highlight */}
              <div style={{ background: 'rgba(6, 11, 26, 0.7)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 4, padding: '8px 10px', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-sub)', color: '#64748b', textTransform: 'uppercase' }}>PASSIVE PERK:</div>
                <div style={{ fontSize: 12, color: isUnlocked ? '#38bdf8' : '#64748b', fontFamily: 'var(--font-system)', marginTop: 2 }}>
                  {shadow.perk}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                <span>
                  {shadow.unlockType === 'level' && `Unlocks at Level ${shadow.unlockThreshold}`}
                  {shadow.unlockType === 'focus_sessions' && `Unlocks at ${shadow.unlockThreshold} Focus Sessions`}
                  {shadow.unlockType === 'streak' && `Unlocks at ${shadow.unlockThreshold}-Day Streak`}
                  {shadow.unlockType === 'quests_completed' && `Unlocks at ${shadow.unlockThreshold} Quests Completed`}
                  {shadow.unlockType === 'rank' && `Unlocks at ${shadow.unlockThreshold}-Rank`}
                </span>
                <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center' }}>
                  INSPECT <ChevronRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedShadow && (
        <ShadowDetailModal
          shadow={selectedShadow}
          onClose={() => setSelectedShadow(null)}
        />
      )}
    </div>
  );
}
