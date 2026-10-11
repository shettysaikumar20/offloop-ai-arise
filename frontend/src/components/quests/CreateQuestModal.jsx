import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { X, Sparkles, Plus } from 'lucide-react';
import { STAT_INFO } from '../../types/models.js';

export default function CreateQuestModal({ isOpen, onClose }) {
  const { addCustomQuest } = useSystem();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('daily');
  const [difficulty, setDifficulty] = useState('D');
  const [category, setCategory] = useState('productivity');
  const [statReward, setStatReward] = useState('discipline');
  const [statBonus, setStatBonus] = useState(1);
  const [xpReward, setXpReward] = useState(150);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCustomQuest({
      title,
      description,
      type,
      difficulty,
      category,
      statReward,
      statBonus,
      xpReward
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="system-modal-backdrop" onClick={onClose}>
      <div className="system-modal-content corner-brackets" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        
        <div className="system-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#38bdf8" />
            <h3 className="font-system" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              REGISTER CUSTOM QUEST
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="system-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="system-label">Quest Mission Title</label>
              <input
                type="text"
                className="system-input"
                placeholder="e.g. Read 20 pages of Systems Architecture"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="system-label">Description & Objective Requirements</label>
              <textarea
                className="system-textarea"
                rows={3}
                placeholder="Specific tangible real-world criteria to declare mission complete..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="system-label">Quest Cadence</label>
                <select className="system-select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="daily">Daily Conditioning</option>
                  <option value="weekly">Weekly Gate</option>
                  <option value="custom">Special Custom Objective</option>
                </select>
              </div>

              <div>
                <label className="system-label">Assigned Difficulty</label>
                <select 
                  className="system-select" 
                  value={difficulty} 
                  onChange={e => {
                    const diff = e.target.value;
                    setDifficulty(diff);
                    // Smart XP auto-suggestion based on rank
                    const xpMap = { E: 100, D: 150, C: 250, B: 450, A: 750, S: 1200 };
                    setXpReward(xpMap[diff] || 150);
                  }}
                >
                  <option value="E">E-Rank (Simple Warmup)</option>
                  <option value="D">D-Rank (Moderate Effort)</option>
                  <option value="C">C-Rank (Demanding Focus)</option>
                  <option value="B">B-Rank (Severe Resistance)</option>
                  <option value="A">A-Rank (High Stakes / Long Grind)</option>
                  <option value="S">S-Rank (Mastery / Groundbreaking)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="system-label">Primary Attribute Bonus</label>
                <select className="system-select" value={statReward} onChange={e => setStatReward(e.target.value)}>
                  {Object.entries(STAT_INFO).map(([key, info]) => (
                    <option key={key} value={key}>{info.code} — {info.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="system-label">Experience (XP) Reward</label>
                <input
                  type="number"
                  className="system-input"
                  min="20"
                  max="5000"
                  value={xpReward}
                  onChange={e => setXpReward(Math.max(10, parseInt(e.target.value, 10) || 0))}
                />
              </div>
            </div>
          </div>

          <div className="system-modal-footer">
            <button type="button" onClick={onClose} className="btn-system" style={{ fontSize: 13 }}>
              CANCEL
            </button>
            <button type="submit" className="btn-system btn-system-primary" style={{ fontSize: 13 }}>
              <Plus size={16} /> REGISTER MISSION
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
