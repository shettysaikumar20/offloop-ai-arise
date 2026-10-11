import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { Play, Pause, RotateCcw, Clock, Zap, CheckCircle2, Award, Sparkles, BookOpen } from 'lucide-react';
import { playSystemBeep } from '../../utils/sound.js';

export default function FocusTimer() {
  const { state, completeFocusSession } = useSystem();
  
  const PRESETS = [
    { label: '15 Min Sprint', minutes: 15 },
    { label: '25 Min Pomodoro', minutes: 25 },
    { label: '45 Min Deep Work', minutes: 45 },
    { label: '60 Min Flow Block', minutes: 60 },
    { label: '90 Min Monastic', minutes: 90 }
  ];

  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState('Deep Reality Immersion');
  const sessionCompletedRef = useRef(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining === 0) {
      setIsActive(false);
      if (!sessionCompletedRef.current) {
        sessionCompletedRef.current = true;
        playSystemBeep('timer_done', state.player.soundEnabled);
        completeFocusSession(selectedMinutes, taskName);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining, selectedMinutes, taskName, state.player.soundEnabled, completeFocusSession]);

  const handleSelectPreset = (mins) => {
    setIsActive(false);
    setSelectedMinutes(mins);
    setSecondsRemaining(mins * 60);
    sessionCompletedRef.current = false;
  };

  const handleToggleTimer = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(selectedMinutes * 60);
      sessionCompletedRef.current = false;
    }
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSecondsRemaining(selectedMinutes * 60);
    sessionCompletedRef.current = false;
  };

  const handleForceComplete = () => {
    if (window.confirm(`Conclude focus session now for ${selectedMinutes} minutes?`)) {
      setIsActive(false);
      setSecondsRemaining(0);
      playSystemBeep('timer_done', state.player.soundEnabled);
      completeFocusSession(selectedMinutes, taskName);
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  const focusHistory = state.focusHistory || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
      
      {/* LEFT: TIMER HUD */}
      <div className="system-panel corner-brackets" style={{ padding: 28, textAlign: 'center' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 999, marginBottom: 16 }}>
          <Clock size={14} color="#38bdf8" />
          <span className="font-system" style={{ fontSize: 11, color: '#38bdf8', letterSpacing: '0.1em' }}>
            FOCUS SANCTUM — TEMPORAL BARRIER ACTIVE
          </span>
        </div>

        {/* Task Title Input */}
        <div style={{ maxWidth: 400, margin: '0 auto 20px' }}>
          <label className="system-label" style={{ textAlign: 'left' }}>Current Focus Objective</label>
          <input
            type="text"
            className="system-input"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            placeholder="What real-world trial are you clearing?"
            style={{ textAlign: 'center', fontWeight: 600 }}
          />
        </div>

        {/* Big Digital Timer Display */}
        {/* Circular SVG Timer HUD with Breathing Aura */}
        <div 
          className={`view-transition ${isActive ? 'timer-active-breathe' : 'timer-paused-breathe'}`}
          style={{
            position: 'relative',
            width: 220,
            height: 220,
            margin: '18px auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="220" height="220" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            {/* Background track circle */}
            <circle
              cx="110"
              cy="110"
              r="90"
              stroke="rgba(30, 41, 75, 0.6)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Progress circle */}
            <circle
              cx="110"
              cy="110"
              r="90"
              stroke="#38bdf8"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={565.48}
              strokeDashoffset={565.48 * (1 - (totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0))}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.6s linear, stroke 0.3s ease',
                filter: isActive ? 'drop-shadow(0 0 6px #38bdf8)' : 'none'
              }}
            />
          </svg>

          {/* Centered Digital Countdown */}
          <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
            <div
              className="font-system"
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: isActive ? '#38bdf8' : '#e2e8f0',
                textShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.7)' : 'none',
                letterSpacing: '0.06em',
                lineHeight: 1
              }}
            >
              {timeFormatted}
            </div>
            <div className="font-sub" style={{ fontSize: 11, color: '#64748b', marginTop: 6, textTransform: 'uppercase' }}>
              {isActive ? 'FLOW BARRIER ACTIVE' : 'SANCTUM READY'}
            </div>
          </div>
        </div>

        {/* Status info row */}
        <div style={{ maxWidth: 380, margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8' }}>
          <span>{progressPercent}% Complete</span>
          <span style={{ color: '#38bdf8', fontFamily: 'var(--font-system)' }}>
            +{Math.max(25, Math.round((selectedMinutes / 10) * 25))} XP Bounty
          </span>
        </div>

        {/* Timer Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 26 }}>
          <button
            onClick={handleToggleTimer}
            className="btn-system btn-system-primary font-system"
            style={{ padding: '12px 28px', fontSize: 14, letterSpacing: '0.1em' }}
          >
            {isActive ? <><Pause size={18} /> PAUSE SANCTUM</> : <><Play size={18} /> INITIATE SANCTUM</>}
          </button>

          <button
            onClick={handleResetTimer}
            className="btn-system font-system"
            style={{ padding: '12px 18px', fontSize: 13 }}
            title="Reset timer"
          >
            <RotateCcw size={16} /> RESET
          </button>
        </div>

        {isActive && (
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={handleForceComplete}
              className="btn-system"
              style={{ fontSize: 11, color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.4)', padding: '5px 12px' }}
            >
              <CheckCircle2 size={13} color="#22c55e" /> CONCLUDE EARLY & CLAIM REWARDS
            </button>
          </div>
        )}

        {/* Presets */}
        <div style={{ borderTop: '1px solid rgba(99, 102, 241, 0.2)', paddingTop: 18 }}>
          <div className="font-sub" style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10 }}>
            CHOOSE SANCTUM INTERVAL PRESET
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <button
                key={p.minutes}
                onClick={() => handleSelectPreset(p.minutes)}
                className="btn-system font-sub"
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  background: selectedMinutes === p.minutes ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                  borderColor: selectedMinutes === p.minutes ? '#38bdf8' : 'rgba(99, 102, 241, 0.2)',
                  color: selectedMinutes === p.minutes ? '#38bdf8' : '#94a3b8'
                }}
              >
                {p.minutes}M
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT: FOCUS SESSION CHRONICLES */}
      <div className="system-panel corner-brackets" style={{ padding: 24 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 className="font-system" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              SANCTUM SESSIONS LOG
            </h3>
            <p className="font-sub" style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
              Lifetime Focus: <span style={{ color: '#38bdf8' }}>{state.player.totalFocusMinutes} minutes</span>
            </p>
          </div>
          <span className="font-system" style={{ fontSize: 12, color: '#a855f7' }}>
            {focusHistory.length} SESSIONS
          </span>
        </div>

        {focusHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <Clock size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <p className="font-sub" style={{ fontSize: 14 }}>No sanctum sessions recorded yet.</p>
            <p style={{ fontSize: 12 }}>Engage a 25-minute Pomodoro block to log your first record.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
            {focusHistory.map(session => (
              <div
                key={session.id}
                style={{
                  background: 'rgba(6, 11, 26, 0.7)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 6,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div>
                  <h5 className="font-system" style={{ fontSize: 13, color: '#f8fafc', margin: 0 }}>
                    {session.taskName}
                  </h5>
                  <span className="font-sub" style={{ fontSize: 11, color: '#64748b' }}>
                    {new Date(session.timestamp).toLocaleDateString()} at {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="font-system" style={{ fontSize: 13, color: '#38bdf8' }}>
                    {session.minutes} MIN
                  </div>
                  <div className="font-system" style={{ fontSize: 11, color: '#22c55e' }}>
                    +{session.xpEarned} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
