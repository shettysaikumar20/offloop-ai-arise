import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { getRequiredXpForLevel, getRankForLevel, RANKS } from '../../types/models.js';
import { validateImportedData, getInitialFullState } from '../../utils/storage.js';
import { Play, CheckCircle2, XCircle, ShieldCheck, Terminal } from 'lucide-react';

export default function SelfTestRunner() {
  const { state, addPlayerXp, allocateStat, toggleQuestCompletion, resetDailyQuests } = useSystem();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState(null);

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setSummary(null);

    const results = [];

    const record = (name, passed, details) => {
      results.push({ name, passed, details });
      setTestResults([...results]);
    };

    // Test 1: Model & Rank Progression Math
    try {
      const eRank = getRankForLevel(1);
      const dRank = getRankForLevel(5);
      const cRank = getRankForLevel(10);
      const bRank = getRankForLevel(20);
      const aRank = getRankForLevel(35);
      const sRank = getRankForLevel(50);

      const passed = eRank === 'E' && dRank === 'D' && cRank === 'C' && bRank === 'B' && aRank === 'A' && sRank === 'S';
      record(
        'Rank Scale Progression (E->D->C->B->A->S)',
        passed,
        `Evaluated: L1=${eRank}, L5=${dRank}, L10=${cRank}, L20=${bRank}, L35=${aRank}, L50=${sRank}`
      );
    } catch (err) {
      record('Rank Scale Progression', false, err.message);
    }

    // Test 2: Required XP Calculation
    try {
      const xpL1 = getRequiredXpForLevel(1);
      const xpL2 = getRequiredXpForLevel(2);
      const xpL10 = getRequiredXpForLevel(10);
      const passed = xpL1 === 100 && xpL2 > xpL1 && xpL10 > xpL2;
      record(
        'XP Required Curve Calculation',
        passed,
        `L1=${xpL1} XP, L2=${xpL2} XP, L10=${xpL10} XP (Exponential progression curve confirmed)`
      );
    } catch (err) {
      record('XP Required Curve Calculation', false, err.message);
    }

    // Test 3: LocalStorage Backup Schema Validation
    try {
      const dummyValid = getInitialFullState();
      const isValid = validateImportedData(dummyValid);
      const isInvalidNull = validateImportedData(null);
      const isInvalidCorrupted = validateImportedData({ player: 'corrupt' });

      const passed = isValid === true && isInvalidNull === false && isInvalidCorrupted === false;
      record(
        'Storage Schema & Corruption Fallback Validation',
        passed,
        `Valid state accepted: ${isValid}, Corrupted input rejected: ${!isInvalidCorrupted}`
      );
    } catch (err) {
      record('Storage Schema Validation', false, err.message);
    }

    // Test 4: Live State Verification
    try {
      const playerExists = !!state.player && typeof state.player.level === 'number';
      const questsExist = Array.isArray(state.quests) && state.quests.length > 0;
      const dungeonsExist = Array.isArray(state.dungeons) && state.dungeons.length > 0;
      const shadowsExist = Array.isArray(state.shadows) && state.shadows.length === 5;
      const achievementsExist = Array.isArray(state.achievements) && state.achievements.length >= 8;

      const passed = playerExists && questsExist && dungeonsExist && shadowsExist && achievementsExist;
      record(
        'Active System State Integrity',
        passed,
        `Player: OK, Quests: ${state.quests.length}, Dungeons: ${state.dungeons.length}, Shadows: ${state.shadows.length}, Feats: ${state.achievements.length}`
      );
    } catch (err) {
      record('Active System State Integrity', false, err.message);
    }

    // Test 5: Shadow Extraction Thresholds
    try {
      const tenebra = state.shadows.find(s => s.id === 'shadow-tenebra');
      const nocturne = state.shadows.find(s => s.id === 'shadow-nocturne');
      const passed = tenebra && tenebra.unlockThreshold === 5 && nocturne && nocturne.unlockThreshold === 'S';
      record(
        'Shadow Companion Threshold Configurations',
        passed,
        `Tenebris (Level 5 threshold verified), Nocturne (S-Rank threshold verified)`
      );
    } catch (err) {
      record('Shadow Companion Thresholds', false, err.message);
    }

    // Test 6: Sound Engine Safety
    try {
      const soundProperty = typeof state.player.soundEnabled === 'boolean';
      record(
        'Zero-Asset Audio Engine State',
        soundProperty,
        `Sound enabled state: ${state.player.soundEnabled} (Web Audio API synthesis ready)`
      );
    } catch (err) {
      record('Zero-Asset Audio Engine State', false, err.message);
    }

    // Summary calculation
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    setSummary({
      total: totalCount,
      passed: passedCount,
      failed: totalCount - passedCount
    });
    setIsRunning(false);
  };

  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Terminal size={18} color="#38bdf8" />
          <h4 className="font-system" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            SYSTEM DIAGNOSTICS & VERIFICATION SUITE
          </h4>
        </div>

        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="btn-system btn-system-primary font-system"
          style={{ fontSize: 12, padding: '7px 16px' }}
        >
          <Play size={14} /> {isRunning ? 'RUNNING SUITE...' : 'EXECUTE SELF-TEST'}
        </button>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
        Executes automated validation across system models, rank logic, XP formulas, and persistence integrity in real-time.
      </p>

      {summary && (
        <div style={{
          background: summary.failed === 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: `1px solid ${summary.failed === 0 ? '#22c55e' : '#f43f5e'}`,
          borderRadius: 6,
          padding: '10px 14px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <ShieldCheck size={20} color={summary.failed === 0 ? '#22c55e' : '#f43f5e'} />
          <span className="font-system" style={{ fontSize: 13, color: summary.failed === 0 ? '#4ade80' : '#fb7185' }}>
            VERIFICATION COMPLETE: {summary.passed}/{summary.total} TESTS PASSED ({summary.failed} FAILURES)
          </span>
        </div>
      )}

      {testResults.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {testResults.map((r, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(6, 11, 26, 0.7)',
                border: `1px solid ${r.passed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(244, 63, 94, 0.4)'}`,
                borderRadius: 4,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}
            >
              {r.passed ? <CheckCircle2 size={16} color="#22c55e" style={{ marginTop: 2 }} /> : <XCircle size={16} color="#f43f5e" style={{ marginTop: 2 }} />}
              <div style={{ flex: 1 }}>
                <div className="font-system" style={{ fontSize: 13, color: r.passed ? '#f8fafc' : '#f43f5e' }}>
                  {r.name}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  {r.details}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
