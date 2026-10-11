import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import DungeonRunnerModal from './DungeonRunnerModal.jsx';
import { Skull, Clock, Zap, Sparkles, ShieldAlert, ChevronRight } from 'lucide-react';
import { STAT_INFO, RANKS } from '../../types/models.js';

export default function DungeonList() {
  const { state } = useSystem();
  const [selectedDungeon, setSelectedDungeon] = useState(null);

  const dungeons = state.dungeons || [];

  return (
    <div>
      {/* Intro Banner */}
      <div className="system-panel corner-brackets" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <ShieldAlert size={22} color="#f43f5e" />
          <h2 className="font-system" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
            DUNGEON RAID CHALLENGES
          </h2>
        </div>
        <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 700 }}>
          High-intensity, multi-phase productivity gates. Lock your senses, defeat external entropy, and conquer real-world trials before the countdown expires.
        </p>
      </div>

      {/* Grid of Dungeon Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
        {dungeons.map(dungeon => {
          const rankInfo = RANKS[dungeon.rank] || RANKS.D;
          const statInfo = STAT_INFO[dungeon.statReward] || STAT_INFO.discipline;

          return (
            <div
              key={dungeon.id}
              className="system-panel corner-brackets"
              style={{
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: `rgba(${dungeon.rank === 'S' ? '250, 204, 21' : dungeon.rank === 'B' ? '168, 85, 247' : '99, 102, 241'}, 0.35)`
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className={`rank-badge rank-${dungeon.rank}`}>
                    {dungeon.rank}-RANK GATE
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontSize: 13, fontFamily: 'var(--font-system)' }}>
                    <Clock size={14} />
                    <span>{dungeon.timeLimitMinutes} MIN</span>
                  </div>
                </div>

                <h3 className="font-system" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
                  {dungeon.name}
                </h3>

                <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', marginBottom: 16, lineHeight: 1.4 }}>
                  "{dungeon.lore}"
                </p>

                {/* Phases Preview */}
                <div style={{ background: 'rgba(6, 11, 26, 0.7)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 6, padding: '12px 14px', marginBottom: 18 }}>
                  <div className="font-sub" style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                    MISSION STAGES ({dungeon.phases.length} PHASES)
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {dungeon.phases.map((p, idx) => (
                      <li key={p.id} style={{ fontSize: 12, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#38bdf8', fontFamily: 'var(--font-system)', fontSize: 10 }}>0{idx + 1}.</span>
                        <span>{p.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Rewards & Enter Gate Button */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span className="font-sub" style={{ fontSize: 11, color: '#94a3b8' }}>CONQUEST BOUNTY:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="font-system" style={{ fontSize: 12, color: '#38bdf8' }}>
                      <Zap size={13} style={{ display: 'inline', marginRight: 4 }} />
                      +{dungeon.xpReward} XP
                    </span>
                    <span className="font-system" style={{ fontSize: 12, color: statInfo.color }}>
                      <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} />
                      +{dungeon.statBonus} {statInfo.code}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDungeon(dungeon)}
                  className="btn-system btn-system-primary font-system"
                  style={{ width: '100%', padding: '10px 16px', fontSize: 13, letterSpacing: '0.08em' }}
                >
                  <Skull size={15} /> ENTER DUNGEON GATE
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Live Runner Modal */}
      {selectedDungeon && (
        <DungeonRunnerModal
          dungeon={selectedDungeon}
          onClose={() => setSelectedDungeon(null)}
        />
      )}
    </div>
  );
}
