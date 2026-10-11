import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { X, Play, Pause, CheckSquare, Square, Skull, Shield, Zap, Sparkles, Clock } from 'lucide-react';
import { STAT_INFO } from '../../types/models.js';

export default function DungeonRunnerModal({ dungeon, onClose }) {
  const { clearDungeonChallenge } = useSystem();
  
  // Timer state (seconds)
  const initialSeconds = dungeon.timeLimitMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [completedPhases, setCompletedPhases] = useState({});

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const togglePhase = (phaseId) => {
    setCompletedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  const totalPhases = dungeon.phases.length;
  const finishedPhasesCount = Object.values(completedPhases).filter(Boolean).length;
  const allPhasesDone = finishedPhasesCount === totalPhases;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const statInfo = STAT_INFO[dungeon.statReward] || STAT_INFO.discipline;

  const handleClaimVictory = () => {
    clearDungeonChallenge(dungeon.id);
    onClose();
  };

  return (
    <div className="system-modal-backdrop" onClick={onClose}>
      <div 
        className="system-modal-content corner-brackets dungeon-portal-enter" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 620,
          background: 'linear-gradient(180deg, rgba(14, 20, 46, 0.98), rgba(7, 10, 24, 0.98))',
          border: '1px solid #f43f5e',
          boxShadow: '0 0 40px rgba(244, 63, 94, 0.35), 0 20px 50px rgba(0, 0, 0, 0.85)'
        }}
      >
        {/* Header */}
        <div className="system-modal-header" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Skull size={22} color="#f43f5e" />
            <div>
              <span className="font-system" style={{ fontSize: 11, color: '#f43f5e', letterSpacing: '0.1em' }}>
                DUNGEON RAID ENGAGED
              </span>
              <h3 className="font-system" style={{ fontSize: 16, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                {dungeon.name}
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="system-modal-body">
          
          {/* Timer HUD Banner */}
          <div style={{ background: 'rgba(5, 8, 20, 0.85)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Clock size={24} color={secondsRemaining < 300 ? '#f43f5e' : '#38bdf8'} />
              <div>
                <span className="font-sub" style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>RAID TIME REMAINING</span>
                <div className="font-system" style={{ fontSize: 30, fontWeight: 900, color: secondsRemaining < 300 ? '#f43f5e' : '#f8fafc', letterSpacing: '0.08em', lineHeight: 1.1 }}>
                  {timeFormatted}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="btn-system font-system"
              style={{ fontSize: 12, padding: '8px 14px' }}
            >
              {isRunning ? <><Pause size={14} /> PAUSE</> : <><Play size={14} /> RESUME</>}
            </button>
          </div>

          <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', marginBottom: 18, lineHeight: 1.4 }}>
            "{dungeon.lore}"
          </p>

          {/* Phases Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-system" style={{ fontSize: 12, color: '#cbd5e1' }}>RAID PHASES ({finishedPhasesCount}/{totalPhases})</span>
              <span className="font-sub" style={{ fontSize: 12, color: allPhasesDone ? '#22c55e' : '#f59e0b' }}>
                {allPhasesDone ? 'BOSS VULNERABLE' : 'CLEAR ALL PHASES TO STRIKE'}
              </span>
            </div>

            {dungeon.phases.map(phase => {
              const isDone = !!completedPhases[phase.id];
              return (
                <div
                  key={phase.id}
                  onClick={() => togglePhase(phase.id)}
                  style={{
                    background: isDone ? 'rgba(34, 197, 94, 0.1)' : 'rgba(10, 16, 36, 0.7)',
                    border: `1px solid ${isDone ? 'rgba(34, 197, 94, 0.4)' : 'rgba(99, 102, 241, 0.25)'}`,
                    borderRadius: 6,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ marginTop: 2 }}>
                    {isDone ? (
                      <CheckSquare size={18} color="#22c55e" />
                    ) : (
                      <Square size={18} color="#64748b" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 className="font-system" style={{ fontSize: 13, fontWeight: 700, color: isDone ? '#4ade80' : '#f8fafc', margin: 0, textDecoration: isDone ? 'line-through' : 'none' }}>
                      {phase.title}
                    </h5>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0', lineHeight: 1.3 }}>
                      {phase.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rewards Preview */}
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-sub" style={{ fontSize: 12, color: '#94a3b8' }}>CONQUEST BOUNTY:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="font-system" style={{ fontSize: 12, color: '#38bdf8' }}>
                <Zap size={13} color="#38bdf8" style={{ display: 'inline', marginRight: 4 }} />
                +{dungeon.xpReward} XP
              </span>
              <span className="font-system" style={{ fontSize: 12, color: statInfo.color }}>
                <Sparkles size={13} color={statInfo.color} style={{ display: 'inline', marginRight: 4 }} />
                +{dungeon.statBonus} {statInfo.code}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="system-modal-footer">
          <button onClick={onClose} className="btn-system" style={{ fontSize: 13 }}>
            RETREAT
          </button>
          <button
            onClick={handleClaimVictory}
            disabled={!allPhasesDone}
            className="btn-system btn-system-primary font-system"
            style={{
              fontSize: 13,
              background: allPhasesDone ? 'linear-gradient(135deg, #10b981, #059669)' : undefined,
              borderColor: allPhasesDone ? '#34d399' : undefined
            }}
          >
            <Skull size={15} /> STRIKE BOSS — CLAIM VICTORY
          </button>
        </div>

      </div>
    </div>
  );
}
