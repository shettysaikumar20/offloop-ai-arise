import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { STAT_INFO, RANKS } from '../../types/models.js';
import { Check, CheckCircle2, Circle, Flame, Sparkles, Trash2, Zap } from 'lucide-react';

export default function QuestCard({ quest }) {
  const { toggleQuestCompletion, deleteQuest } = useSystem();
  const [showFloatingXp, setShowFloatingXp] = useState(false);
  const [isJustCleared, setIsJustCleared] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const statInfo = STAT_INFO[quest.statReward] || STAT_INFO.discipline;
  const isCustom = quest.id.startsWith('quest-custom');
  const isCompleted = quest.completed;

  const handleToggle = () => {
    if (isProcessing) return; // Prevent duplicate clicks
    setIsProcessing(true);

    if (!isCompleted) {
      setIsJustCleared(true);
      setShowFloatingXp(true);
      setTimeout(() => setShowFloatingXp(false), 900);
      setTimeout(() => setIsJustCleared(false), 800);
    }

    toggleQuestCompletion(quest.id);
    setTimeout(() => setIsProcessing(false), 300);
  };

  return (
    <div
      className={`system-panel ${isJustCleared ? 'card-cleared-anim' : ''}`}
      style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        background: isCompleted ? 'rgba(8, 14, 30, 0.45)' : 'rgba(10, 16, 36, 0.85)',
        borderColor: isCompleted ? 'rgba(34, 197, 94, 0.35)' : 'rgba(99, 102, 241, 0.28)',
        opacity: isCompleted ? 0.78 : 1,
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Floating XP Reward Indicator */}
      {showFloatingXp && (
        <div className="floating-xp-indicator">
          +{quest.xpReward} XP
        </div>
      )}

      {/* Left: Checkmark & Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
        <button
          onClick={handleToggle}
          disabled={isProcessing}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginTop: 2,
            display: 'flex',
            alignItems: 'center'
          }}
          title={isCompleted ? 'Mark quest as incomplete' : 'Claim quest completion'}
        >
          {isCompleted ? (
            <CheckCircle2 size={24} color="#22c55e" />
          ) : (
            <Circle size={24} color="#64748b" />
          )}
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span className={`rank-badge rank-${quest.difficulty}`} style={{ fontSize: 11, padding: '2px 7px' }}>
              {quest.difficulty}-RANK
            </span>
            <span style={{
              fontSize: 11,
              fontFamily: 'var(--font-sub)',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: quest.type === 'daily' ? '#38bdf8' : quest.type === 'weekly' ? '#a855f7' : '#f59e0b',
              letterSpacing: '0.08em'
            }}>
              [{quest.type}]
            </span>
            <h4
              className="font-system"
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: isCompleted ? '#94a3b8' : '#f8fafc',
                textDecoration: isCompleted ? 'line-through' : 'none',
                margin: 0
              }}
            >
              {quest.title}
            </h4>
          </div>

          <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.4 }}>
            {quest.description}
          </p>

          {/* Reward Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontFamily: 'var(--font-system)',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '2px 8px',
              borderRadius: 4
            }}>
              <Zap size={11} color="#38bdf8" />
              +{quest.xpReward} XP
            </span>

            {statInfo && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontFamily: 'var(--font-system)',
                color: statInfo.color,
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${statInfo.color}40`,
                padding: '2px 8px',
                borderRadius: 4
              }}>
                <Flame size={11} color={statInfo.color} />
                +{quest.statBonus || 1} {statInfo.code}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={handleToggle}
          disabled={isProcessing}
          className={`btn-system font-system ${isCompleted ? '' : 'btn-system-primary'}`}
          style={{
            fontSize: 12,
            padding: '7px 14px',
            background: isCompleted ? 'rgba(34, 197, 94, 0.15)' : undefined,
            borderColor: isCompleted ? '#22c55e' : undefined,
            color: isCompleted ? '#4ade80' : undefined
          }}
        >
          {isCompleted ? (
            <>
              <Check size={14} /> CLEARED
            </>
          ) : (
            <>
              CLAIM REWARD
            </>
          )}
        </button>

        {isCustom && (
          <button
            onClick={() => deleteQuest(quest.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 4
            }}
            title="Abandon Custom Quest"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
