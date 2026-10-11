import React from 'react';
import { X, Sparkles, Shield, Zap, Lock, Unlock } from 'lucide-react';
import { RANKS } from '../../types/models.js';

export default function ShadowDetailModal({ shadow, onClose }) {
  if (!shadow) return null;

  const rankInfo = RANKS[shadow.rank] || RANKS.E;

  return (
    <div className="system-modal-backdrop" onClick={onClose}>
      <div
        className="system-modal-content corner-brackets"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 500,
          background: 'linear-gradient(180deg, rgba(10, 16, 40, 0.98), rgba(4, 7, 18, 0.98))',
          border: `1px solid ${shadow.unlocked ? '#38bdf8' : 'rgba(99, 102, 241, 0.3)'}`,
          boxShadow: shadow.unlocked ? '0 0 35px rgba(56, 189, 248, 0.35)' : 'none'
        }}
      >
        <div className="system-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {shadow.unlocked ? <Unlock size={18} color="#38bdf8" /> : <Lock size={18} color="#64748b" />}
            <div>
              <span className={`rank-badge rank-${shadow.rank}`} style={{ fontSize: 10, padding: '1px 6px', marginRight: 6 }}>
                {shadow.rank}-RANK
              </span>
              <span className="font-system" style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>
                {shadow.name} — {shadow.title}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="system-modal-body">
          <div style={{ textAlign: 'center', margin: '14px 0 20px' }}>
            <div style={{ width: 80, height: 80, borderRadius: 16, margin: '0 auto 12px', background: shadow.unlocked ? 'linear-gradient(135deg, #1e1b4b, #312e81)' : 'rgba(15, 23, 42, 0.8)', border: `2px solid ${shadow.unlocked ? '#38bdf8' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadow.unlocked ? '0 0 24px rgba(56, 189, 248, 0.4)' : 'none' }}>
              <Sparkles size={36} color={shadow.unlocked ? '#38bdf8' : '#64748b'} />
            </div>
            <h3 className="font-system" style={{ fontSize: 20, color: shadow.unlocked ? '#f8fafc' : '#94a3b8', margin: 0 }}>
              {shadow.name}
            </h3>
            <div className="font-sub" style={{ fontSize: 14, color: shadow.unlocked ? '#c084fc' : '#64748b' }}>
              {shadow.title}
            </div>
          </div>

          <div style={{ background: 'rgba(6, 11, 26, 0.7)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
            <span className="font-sub" style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>SOVEREIGN PASSIVE PERK</span>
            <div className="font-system" style={{ fontSize: 13, color: '#38bdf8', marginTop: 4 }}>
              {shadow.perk}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span className="font-sub" style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>EXTRACTED LORE</span>
            <p style={{ fontSize: 13, color: '#cbd5e1', fontStyle: 'italic', marginTop: 4, lineHeight: 1.4 }}>
              "{shadow.lore}"
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-sub" style={{ fontSize: 12, color: '#94a3b8' }}>STATUS:</span>
            <span className="font-system" style={{ fontSize: 12, color: shadow.unlocked ? '#22c55e' : '#f59e0b' }}>
              {shadow.unlocked ? `EXTRACTED (${new Date(shadow.unlockedAt).toLocaleDateString()})` : 'DORMANT (REQUIRES MILESTONE)'}
            </span>
          </div>
        </div>

        <div className="system-modal-footer">
          <button onClick={onClose} className="btn-system font-system" style={{ fontSize: 13, width: '100%' }}>
            DISMISS CODEX
          </button>
        </div>
      </div>
    </div>
  );
}
