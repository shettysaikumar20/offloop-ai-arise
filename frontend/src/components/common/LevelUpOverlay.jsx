import React from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { RANKS } from '../../types/models.js';
import { Sparkles, ArrowRight, Zap, Award } from 'lucide-react';

export default function LevelUpOverlay() {
  const { levelUpModal, setLevelUpModal } = useSystem();

  if (!levelUpModal) return null;

  const { oldLevel, newLevel, statPointsGained, oldRank, newRank, rankPromoted } = levelUpModal;
  const rankInfo = RANKS[newRank] || RANKS.E;

  return (
    <div className="system-modal-backdrop" onClick={() => setLevelUpModal(null)}>
      <div 
        className="system-modal-content corner-brackets" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 500,
          background: 'linear-gradient(180deg, rgba(16, 24, 52, 0.98), rgba(8, 12, 28, 0.98))',
          border: '1px solid #facc15',
          boxShadow: '0 0 50px rgba(250, 204, 21, 0.35), 0 20px 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div className="levelup-overlay">
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', background: 'rgba(250, 204, 21, 0.15)', border: '1px solid rgba(250, 204, 21, 0.4)', borderRadius: 999, marginBottom: 16 }}>
            <Sparkles size={16} color="#facc15" />
            <span className="font-system" style={{ fontSize: 11, color: '#fef08a', letterSpacing: '0.12em' }}>
              THE SYSTEM HAS ISSUED A NOTICE
            </span>
          </div>

          <h2 className="levelup-banner-title">
            LEVEL UP!
          </h2>

          <p className="levelup-sub">
            Your physical and mental vessel has expanded. Mana capacity increased.
          </p>

          {/* Level Transition Row */}
          <div className="levelup-numbers-row">
            <div style={{ textAlign: 'center' }}>
              <div className="font-sub" style={{ fontSize: 13, color: '#64748b' }}>PREVIOUS</div>
              <div className="font-system" style={{ fontSize: 32, fontWeight: 800, color: '#94a3b8' }}>
                LV. {oldLevel}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={28} color="#38bdf8" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="font-sub" style={{ fontSize: 13, color: '#38bdf8' }}>ASCENDED</div>
              <div className="font-system" style={{ fontSize: 38, fontWeight: 900, color: '#facc15', textShadow: '0 0 16px rgba(250, 204, 21, 0.6)' }}>
                LV. {newLevel}
              </div>
            </div>
          </div>

          {/* Rank Promotion Banner if rank changed */}
          {rankPromoted && (
            <div style={{ margin: '20px 0', padding: 14, background: 'rgba(139, 92, 246, 0.15)', border: '1px solid #8b5cf6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Award size={24} color="#c084fc" />
              <div>
                <div className="font-system" style={{ fontSize: 12, color: '#c084fc' }}>
                  RANK RE-EVALUATION
                </div>
                <div className="font-system" style={{ fontSize: 17, fontWeight: 800, color: rankInfo.color }}>
                  PROMOTED TO {rankInfo.label}
                </div>
              </div>
            </div>
          )}

          {/* Rewards Granted */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '24px 0 28px' }}>
            <div className="levelup-stat-badge">
              <Zap size={15} color="#facc15" style={{ display: 'inline', marginRight: 6 }} />
              +{statPointsGained} STAT POINTS AVAILABLE
            </div>
          </div>

          <button
            onClick={() => setLevelUpModal(null)}
            className="btn-system btn-system-primary font-system"
            style={{ width: '100%', padding: '14px 20px', fontSize: 15, letterSpacing: '0.12em' }}
          >
            ARISE — EMBRACE NEW POWER
          </button>

        </div>
      </div>
    </div>
  );
}
