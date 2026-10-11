import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { RANKS, STAT_INFO, getRequiredXpForLevel } from '../../types/models.js';
import { Flame, Sparkles, Shield, Zap, Award, Edit3, Check, Trophy, Clock, Skull, ArrowUpRight } from 'lucide-react';

export default function PlayerStatus() {
  const { state, allocateStat, updateHunterProfile } = useSystem();
  const { player } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(player.name);
  const [tempTitle, setTempTitle] = useState(player.title);

  const reqXp = getRequiredXpForLevel(player.level);
  const xpPercent = Math.min(100, Math.round((player.currentXp / reqXp) * 100));
  const currentRankInfo = RANKS[player.rank] || RANKS.E;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateHunterProfile(tempName, tempTitle);
    setIsEditing(false);
  };

  const RANK_LADDER = ['E', 'D', 'C', 'B', 'A', 'S'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
      
      {/* LEFT COLUMN: HUNTER STATUS PROFILE */}
      <div className="system-panel corner-brackets" style={{ padding: 24 }}>
        
        {/* Hunter Identity Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className={`rank-badge rank-${player.rank}`}>
                {currentRankInfo.label}
              </span>
              <span className="font-system" style={{ fontSize: 13, color: '#38bdf8' }}>
                ID #{player.level.toString().padStart(4, '0')}
              </span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ marginTop: 8 }}>
                <input
                  type="text"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="system-input"
                  style={{ marginBottom: 6, fontSize: 16 }}
                  placeholder="Hunter Name"
                  required
                />
                <input
                  type="text"
                  value={tempTitle}
                  onChange={e => setTempTitle(e.target.value)}
                  className="system-input"
                  style={{ marginBottom: 8, fontSize: 13 }}
                  placeholder="Hunter Title"
                />
                <button type="submit" className="btn-system btn-system-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
                  <Check size={14} /> SAVE IDENTITY
                </button>
              </form>
            ) : (
              <div>
                <h2 className="font-system" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 2px' }}>
                  {player.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p className="font-sub" style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>
                    Title: <span style={{ color: '#c084fc' }}>{player.title}</span>
                  </p>
                  <button
                    onClick={() => {
                      setTempName(player.name);
                      setTempTitle(player.title);
                      setIsEditing(true);
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                    title="Edit Name and Title"
                  >
                    <Edit3 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ width: 64, height: 64, borderRadius: 10, background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(15, 23, 42, 0.9))', border: `1px solid ${currentRankInfo.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${currentRankInfo.glow}` }}>
            <span className="font-system" style={{ fontSize: 26, fontWeight: 900, color: currentRankInfo.color, lineHeight: 1 }}>
              {player.rank}
            </span>
            <span className="font-sub" style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>RANK</span>
          </div>
        </div>

        {/* Level & XP Gauge */}
        <div style={{ background: 'rgba(6, 11, 26, 0.7)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
            <div>
              <span className="font-sub" style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>Current Vessel</span>
              <div className="font-system" style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc' }}>
                LEVEL {player.level}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="font-sub" style={{ fontSize: 12, color: '#94a3b8' }}>EXP PROGRESS</span>
              <div className="font-system" style={{ fontSize: 14, color: '#38bdf8' }}>
                {player.currentXp} <span style={{ color: '#64748b' }}>/ {reqXp} XP</span>
              </div>
            </div>
          </div>

          <div className="system-progress-track" style={{ height: 12 }}>
            <div className="system-progress-fill" style={{ width: `${xpPercent}%` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#64748b' }}>
            <span>{xpPercent}% to Level {player.level + 1}</span>
            <span>{reqXp - player.currentXp} XP remaining</span>
          </div>
        </div>

        {/* Lifetime Telemetry Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '12px 10px', borderRadius: 6, textAlign: 'center' }}>
            <Trophy size={18} color="#facc15" style={{ margin: '0 auto 4px' }} />
            <div className="font-system" style={{ fontSize: 18, color: '#f8fafc', fontWeight: 800 }}>
              {player.totalQuestsCompleted}
            </div>
            <div className="font-sub" style={{ fontSize: 11, color: '#94a3b8' }}>Quests Cleared</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '12px 10px', borderRadius: 6, textAlign: 'center' }}>
            <Clock size={18} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
            <div className="font-system" style={{ fontSize: 18, color: '#f8fafc', fontWeight: 800 }}>
              {player.totalFocusMinutes}m
            </div>
            <div className="font-sub" style={{ fontSize: 11, color: '#94a3b8' }}>Deep Focus</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '12px 10px', borderRadius: 6, textAlign: 'center' }}>
            <Skull size={18} color="#f43f5e" style={{ margin: '0 auto 4px' }} />
            <div className="font-system" style={{ fontSize: 18, color: '#f8fafc', fontWeight: 800 }}>
              {player.totalDungeonsCleared}
            </div>
            <div className="font-sub" style={{ fontSize: 11, color: '#94a3b8' }}>Raids Conquered</div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: CORE STATS & ATTRIBUTION */}
      <div className="system-panel corner-brackets" style={{ padding: 24 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 className="font-system" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              CORE ATTRIBUTES
            </h3>
            <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', margin: '2px 0 0' }}>
              Reinforce your physical and neurological capabilities.
            </p>
          </div>

          {/* Stat Points Available Pill */}
          <div style={{
            background: player.statPoints > 0 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(30, 41, 59, 0.5)',
            border: player.statPoints > 0 ? '1px solid #facc15' : '1px solid rgba(100, 116, 139, 0.3)',
            color: player.statPoints > 0 ? '#fef08a' : '#64748b',
            padding: '6px 12px',
            borderRadius: 4,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <Sparkles size={14} color={player.statPoints > 0 ? '#facc15' : '#64748b'} />
            <span className="font-system">PTS: {player.statPoints}</span>
          </div>
        </div>

        {/* Stats List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(STAT_INFO).map(([key, info]) => {
            const val = player.stats[key] || 10;
            let IconComponent = Flame;
            if (info.code === 'INT') IconComponent = Sparkles;
            if (info.code === 'DIS') IconComponent = Shield;
            if (info.code === 'END') IconComponent = Zap;

            return (
              <div
                key={key}
                style={{
                  background: 'rgba(6, 11, 26, 0.65)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 6,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(15, 23, 42, 0.8)', border: `1px solid ${info.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={18} color={info.color} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="font-system" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                        {info.name}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
                      {info.desc}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="font-system" style={{ fontSize: 20, fontWeight: 800, color: info.color, minWidth: 36, textAlign: 'right' }}>
                    {val}
                  </span>

                  <button
                    onClick={() => allocateStat(key)}
                    disabled={player.statPoints <= 0}
                    className="btn-system font-system"
                    style={{
                      padding: '4px 8px',
                      fontSize: 12,
                      background: player.statPoints > 0 ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                      borderColor: player.statPoints > 0 ? '#818cf8' : 'rgba(71, 85, 105, 0.3)',
                      color: player.statPoints > 0 ? '#fff' : '#475569'
                    }}
                    title={player.statPoints > 0 ? `Allocate +1 to ${info.code}` : 'No stat points available (Level up to earn +3)'}
                  >
                    +1
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rank Progression Overview */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span className="font-system" style={{ fontSize: 12, color: '#94a3b8' }}>RANK ASCENSION LADDER</span>
            <span className="font-sub" style={{ fontSize: 12, color: '#38bdf8' }}>Current: {player.rank}-Rank</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RANK_LADDER.map(r => {
              const rInfo = RANKS[r];
              const isCurrent = player.rank === r;
              const isPast = player.level >= rInfo.minLevel;
              return (
                <div
                  key={r}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    textAlign: 'center',
                    background: isCurrent ? 'rgba(99, 102, 241, 0.3)' : isPast ? 'rgba(30, 41, 59, 0.4)' : 'rgba(15, 23, 42, 0.2)',
                    border: `1px solid ${isCurrent ? rInfo.color : isPast ? 'rgba(99, 102, 241, 0.3)' : 'rgba(51, 65, 85, 0.2)'}`,
                    borderRadius: 4
                  }}
                >
                  <div className="font-system" style={{ fontSize: 14, fontWeight: 800, color: isCurrent ? rInfo.color : isPast ? '#94a3b8' : '#475569' }}>
                    {r}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>
                    Lv.{rInfo.minLevel}+
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
