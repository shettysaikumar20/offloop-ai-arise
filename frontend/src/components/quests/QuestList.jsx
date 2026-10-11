import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import QuestCard from './QuestCard.jsx';
import CreateQuestModal from './CreateQuestModal.jsx';
import { Plus, RotateCcw, Filter, Swords, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuestList() {
  const { state, resetDailyQuests } = useSystem();
  const [filterType, setFilterType] = useState('all'); // all, daily, weekly, custom
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed
  const [isModalOpen, setIsModalOpen] = useState(false);

  const quests = state.quests || [];

  const filteredQuests = quests.filter(q => {
    if (filterType !== 'all') {
      if (filterType === 'custom') {
        if (!q.id.startsWith('quest-custom')) return false;
      } else {
        if (q.type !== filterType) return false;
      }
    }
    if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) {
      return false;
    }
    if (filterStatus === 'active' && q.completed) return false;
    if (filterStatus === 'completed' && !q.completed) return false;
    return true;
  });

  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;

  const handleResetConfirm = () => {
    if (window.confirm('Execute System Daily Reset? This will refresh all Daily Conditioning missions.')) {
      resetDailyQuests();
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="system-panel corner-brackets" style={{ padding: '18px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Swords size={20} color="#38bdf8" />
              <h2 className="font-system" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                SYSTEM QUEST GATES
              </h2>
            </div>
            <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Progress requires action in physical reality. Clear your gates to ascend.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleResetConfirm}
              className="btn-system font-system"
              style={{ fontSize: 12 }}
              title="Reset daily quests"
            >
              <RotateCcw size={14} /> RESET DAILIES
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-system btn-system-primary font-system"
              style={{ fontSize: 12 }}
            >
              <Plus size={16} /> NEW QUEST
            </button>
          </div>

        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
          
          {/* Type filters */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'daily', 'weekly', 'custom'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="btn-system font-sub"
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  background: filterType === t ? 'rgba(99, 102, 241, 0.35)' : 'rgba(15, 23, 42, 0.4)',
                  borderColor: filterType === t ? '#38bdf8' : 'rgba(99, 102, 241, 0.2)',
                  color: filterType === t ? '#38bdf8' : '#94a3b8'
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Difficulty & Status Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="system-select"
              style={{ padding: '4px 10px', fontSize: 12, width: 'auto' }}
            >
              <option value="all">All Difficulties</option>
              <option value="E">E-Rank Only</option>
              <option value="D">D-Rank Only</option>
              <option value="C">C-Rank Only</option>
              <option value="B">B-Rank Only</option>
              <option value="A">A-Rank Only</option>
              <option value="S">S-Rank Only</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="system-select"
              style={{ padding: '4px 10px', fontSize: 12, width: 'auto' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="completed">Cleared Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* Quest Cards Feed */}
      {filteredQuests.length === 0 ? (
        <div className="system-panel" style={{ padding: 40, textAlign: 'center' }}>
          <AlertCircle size={32} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 className="font-system" style={{ fontSize: 16, color: '#cbd5e1', marginBottom: 4 }}>
            NO MATCHING QUESTS IN THE SECTOR
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', maxWidth: 400, margin: '0 auto 16px' }}>
            Adjust your filters or register a new custom quest to summon new trials.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn-system btn-system-primary font-system" style={{ fontSize: 12 }}>
            <Plus size={14} /> CREATE FIRST MISSION
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}

      {/* Create Quest Modal */}
      <CreateQuestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
