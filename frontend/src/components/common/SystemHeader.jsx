import React from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { RANKS, getRequiredXpForLevel } from '../../types/models.js';
import { Volume2, VolumeX, Shield, Sparkles, Flame, Clock } from 'lucide-react';

export default function SystemHeader({ activeTab, setActiveTab }) {
  const { state, toggleSound } = useSystem();
  const { player } = state;

  const currentRankInfo = RANKS[player.rank] || RANKS.E;
  const reqXp = getRequiredXpForLevel(player.level);
  const xpPercent = Math.min(100, Math.round((player.currentXp / reqXp) * 100));

  return (
    <header className="system-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '14px 24px', background: 'rgba(5, 9, 23, 0.92)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 900 }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        
        {/* Logo and Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: '1px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)' }}>
            <Sparkles size={24} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 className="font-system" style={{ fontSize: 19, fontWeight: 900, color: '#f8fafc', letterSpacing: '0.12em', margin: 0 }}>
                OFFLOOP AI: <span style={{ color: '#38bdf8', textShadow: '0 0 12px rgba(56, 189, 248, 0.6)' }}>ARISE</span>
              </h1>
              <span className={`rank-badge rank-${player.rank}`}>
                {player.rank}-RANK
              </span>
            </div>
            <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', margin: 0, letterSpacing: '0.06em' }}>
              Your Real Life Is Your Dungeon.
            </p>
          </div>
        </div>

        {/* Quick HUD Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          
          {/* Level & XP bar */}
          <div style={{ minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span className="font-system" style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 700 }}>
                LVL <span style={{ color: '#38bdf8' }}>{player.level}</span>
              </span>
              <span className="font-sub" style={{ fontSize: 12, color: '#94a3b8' }}>
                {player.currentXp} / {reqXp} XP ({xpPercent}%)
              </span>
            </div>
            <div className="system-progress-track" style={{ height: 7 }}>
              <div className="system-progress-fill" style={{ width: `${xpPercent}%` }}></div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Streak */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(249, 115, 22, 0.35)', padding: '5px 10px', borderRadius: 4 }} title="Current Day Streak">
              <Flame size={15} color="#f97316" />
              <span className="font-system" style={{ fontSize: 12, color: '#fdba74' }}>{player.streakDays}D</span>
            </div>

            {/* Stat Points Available */}
            {player.statPoints > 0 && (
              <button 
                onClick={() => setActiveTab('status')}
                className="btn-system"
                style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(161, 98, 7, 0.25))', border: '1px solid #facc15', color: '#fef08a', padding: '5px 10px', fontSize: 12 }}
                title="Unallocated Stat Points Available! Click to allocate."
              >
                <Sparkles size={13} color="#facc15" />
                <span>+{player.statPoints} STAT PTS</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="btn-system"
              style={{ padding: '6px 10px', background: player.soundEnabled ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.6)' }}
              title={player.soundEnabled ? 'Mute System Sounds' : 'Enable System Sounds'}
            >
              {player.soundEnabled ? <Volume2 size={16} color="#38bdf8" /> : <VolumeX size={16} color="#64748b" />}
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
