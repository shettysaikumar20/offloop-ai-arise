import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { Sparkles, Shield, Flame, Zap, Award, ArrowRight, Check, X, Skull } from 'lucide-react';

export default function HunterAwakeningModal() {
  const { showAwakeningModal, completeAwakening, skipAwakening, state } = useSystem();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(state.player.name || 'Sung Jin-Woo');
  const [title, setTitle] = useState(state.player.title || 'The Reawakened One');
  const [specialization, setSpecialization] = useState('discipline');

  if (!showAwakeningModal) return null;

  const PATHS = [
    {
      id: 'discipline',
      name: 'Iron Will & Digital Detox',
      stat: 'Discipline (+2 DIS)',
      desc: 'Sever the infinite scroll. Reclaim control of attention, habit rhythm, and morning focus.',
      quest: 'First Trial: 2 Continuous Hours Zero Social Media',
      icon: Shield,
      color: '#a855f7'
    },
    {
      id: 'strength',
      name: 'Physical Vessel Awakening',
      stat: 'Strength (+2 STR)',
      desc: 'Transform real-world body stamina through pushups, bodyweight circuits, and fresh outdoor walks.',
      quest: 'First Trial: 50 Bodyweight Pushups & Brisk Walk',
      icon: Flame,
      color: '#f97316'
    },
    {
      id: 'intelligence',
      name: 'Arcane Architect & Scholar',
      stat: 'Intelligence (+2 INT)',
      desc: 'Feed the mind with high-value technical literature, deep books, and analytical synthesis.',
      quest: 'First Trial: 30 Min Deep Non-Fiction Study',
      icon: Sparkles,
      color: '#38bdf8'
    },
    {
      id: 'endurance',
      name: 'Temporal Sentinel',
      stat: 'Endurance (+2 END)',
      desc: 'Withstand grueling cognitive grinds and uninterrupted deep-work focus blocks.',
      quest: 'First Trial: 45 Min Unbroken Deep Focus Block',
      icon: Zap,
      color: '#10b981'
    }
  ];

  const handleFinish = () => {
    completeAwakening(name, title, specialization);
  };

  return (
    <div className="system-modal-backdrop" style={{ background: 'rgba(2, 4, 12, 0.94)', zIndex: 12000 }}>
      <div 
        className="system-modal-content corner-brackets"
        style={{
          maxWidth: 640,
          background: 'linear-gradient(180deg, rgba(14, 20, 50, 0.98), rgba(6, 9, 22, 0.98))',
          border: '1px solid #8b5cf6',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.4), 0 20px 60px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Top Header */}
        <div className="system-modal-header" style={{ borderColor: 'rgba(139, 92, 246, 0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={18} color="#c084fc" />
            <span className="font-system" style={{ fontSize: 13, color: '#c084fc', letterSpacing: '0.12em' }}>
              HUNTER AWAKENING PROTOCOL // STEP {step} OF 3
            </span>
          </div>

          <button 
            onClick={skipAwakening}
            className="font-sub"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            title="Skip directly to dashboard"
          >
            SKIP AWAKENING <X size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="system-modal-body" style={{ padding: '24px 28px' }}>
          
          {/* STEP 1: THE INVITATION */}
          {step === 1 && (
            <div className="view-transition">
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, margin: '0 auto 16px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(139, 92, 246, 0.4)' }}>
                  <Skull size={32} color="#c084fc" />
                </div>
                <h2 className="font-system" style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', letterSpacing: '0.1em', marginBottom: 8 }}>
                  THE SYSTEM HAS CHOSEN YOU
                </h2>
                <p className="font-sub" style={{ fontSize: 14, color: '#94a3b8', maxWidth: 480, margin: '0 auto', lineHeight: 1.5 }}>
                  You have been drifting through endless passive feeds and dopamine comfort. Today, the veil tears open. Your real life is your dungeon.
                </p>
              </div>

              <div style={{ background: 'rgba(8, 12, 30, 0.8)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 8, padding: 18, marginBottom: 24 }}>
                <h4 className="font-system" style={{ fontSize: 12, color: '#38bdf8', marginBottom: 6 }}>
                  SYSTEM AWAKENING NOTICE:
                </h4>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  "Hunters do not level up by wishing. They level up through physical reps, focused hours, and habit consistency. Answer the summons to register your profile."
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="btn-system btn-system-primary font-system"
                style={{ width: '100%', padding: '12px 20px', fontSize: 14 }}
              >
                PROCEED TO REGISTRATION <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: REGISTRATION & TITLE */}
          {step === 2 && (
            <div className="view-transition">
              <h3 className="font-system" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', marginBottom: 4 }}>
                REGISTER YOUR HUNTER IDENTITY
              </h3>
              <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', marginBottom: 18 }}>
                Define the moniker that will be recorded in the System's permanent rank logs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div>
                  <label className="system-label">Hunter Name</label>
                  <input
                    type="text"
                    className="system-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sung Jin-Woo, Alex Vance, etc."
                    required
                  />
                </div>

                <div>
                  <label className="system-label">Hunter Moniker / Title</label>
                  <input
                    type="text"
                    className="system-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. The Reawakened One, Solitary Striker"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} className="btn-system" style={{ flex: 1 }}>
                  BACK
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!name.trim()}
                  className="btn-system btn-system-primary font-system"
                  style={{ flex: 2 }}
                >
                  SELECT SPECIALIZATION <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SPECIALIZATION PATH & FIRST QUEST */}
          {step === 3 && (
            <div className="view-transition">
              <h3 className="font-system" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', marginBottom: 4 }}>
                SELECT YOUR PRIMARY DISCIPLINE
              </h3>
              <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
                Choose your primary focus to receive an immediate +2 Stat boost and your first E-Rank Awakening Quest.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {PATHS.map(path => {
                  const Icon = path.icon;
                  const isSelected = specialization === path.id;
                  return (
                    <div
                      key={path.id}
                      onClick={() => setSpecialization(path.id)}
                      style={{
                        background: isSelected ? 'rgba(30, 27, 75, 0.7)' : 'rgba(8, 12, 28, 0.6)',
                        border: `1px solid ${isSelected ? path.color : 'rgba(99, 102, 241, 0.25)'}`,
                        borderRadius: 6,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? `0 0 16px ${path.color}40` : 'none'
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(15, 23, 42, 0.8)', border: `1px solid ${path.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} color={path.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="font-system" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                            {path.name}
                          </span>
                          <span className="font-system" style={{ fontSize: 11, color: path.color }}>
                            {path.stat}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
                          {path.desc}
                        </p>
                      </div>
                      {isSelected && <Check size={18} color="#22c55e" />}
                    </div>
                  );
                })}
              </div>

              {/* Starter Quest Preview */}
              {(() => {
                const active = PATHS.find(p => p.id === specialization) || PATHS[0];
                return (
                  <div style={{ background: 'rgba(6, 11, 26, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 6, padding: '10px 14px', marginBottom: 20 }}>
                    <div className="font-sub" style={{ fontSize: 11, color: '#38bdf8', textTransform: 'uppercase' }}>
                      FIRST E-RANK QUEST GRANTED:
                    </div>
                    <div className="font-system" style={{ fontSize: 13, color: '#f8fafc', marginTop: 2 }}>
                      {active.quest} (+150 XP & Bounty)
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} className="btn-system" style={{ flex: 1 }}>
                  BACK
                </button>
                <button
                  onClick={handleFinish}
                  className="btn-system btn-system-primary font-system"
                  style={{ flex: 2, padding: '12px 20px', fontSize: 14 }}
                >
                  ARISE — AWAKEN AS HUNTER
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
