import React, { useRef } from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import SelfTestRunner from '../diagnostics/SelfTestRunner.jsx';
import { Settings, Download, Upload, RotateCcw, Volume2, VolumeX, Shield, AlertTriangle, Cpu, Sparkles } from 'lucide-react';

export default function SystemSettings() {
  const { state, toggleSound, triggerExport, triggerImport, resetAllProgress, replayAwakening } = useSystem();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        triggerImport(parsed);
      } catch (err) {
        alert('Invalid JSON file format. Restoration aborted.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetConfirm = () => {
    if (window.confirm('WARNING: Are you sure you want to initialize a complete System Reset? All quests, levels, stats, and achievements will return to initial Level 1 Awakened status.')) {
      resetAllProgress();
    }
  };

  return (
    <div>
      {/* Intro Banner */}
      <div className="system-panel corner-brackets" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Settings size={22} color="#38bdf8" />
          <h2 className="font-system" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
            SYSTEM CONFIGURATION & ARCHIVES
          </h2>
        </div>
        <p className="font-sub" style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 700 }}>
          Manage local storage telemetry, backup state files, audio preferences, and hardware optimization settings.
        </p>
      </div>

      <div className="system-panel corner-brackets" style={{ padding: 24 }}>
        
        {/* Audio Setting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 18, borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div>
            <h4 className="font-system" style={{ fontSize: 15, color: '#f8fafc', margin: 0 }}>
              SYNTHESIZED AUDIO CUES
            </h4>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Zero-asset Web Audio API tones for level-ups, quest completions, and sanctum gongs.
            </p>
          </div>
          <button
            onClick={toggleSound}
            className="btn-system font-system"
            style={{ fontSize: 12 }}
          >
            {state.player.soundEnabled ? (
              <>
                <Volume2 size={15} color="#38bdf8" /> SOUND ACTIVE
              </>
            ) : (
              <>
                <VolumeX size={15} color="#64748b" /> SOUND MUTED
              </>
            )}
          </button>
        </div>

        {/* Replay Hunter Awakening */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 18, borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div>
            <h4 className="font-system" style={{ fontSize: 15, color: '#f8fafc', margin: 0 }}>
              HUNTER AWAKENING RITUAL
            </h4>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
              Re-experience the first-time onboarding ritual, select your discipline path, or update your persona.
            </p>
          </div>
          <button
            onClick={replayAwakening}
            className="btn-system font-system"
            style={{ fontSize: 12, borderColor: '#a855f7', color: '#c084fc' }}
          >
            <Sparkles size={15} color="#c084fc" /> REPLAY AWAKENING
          </button>
        </div>

        {/* Backup & Persistence */}
        <div style={{ padding: '18px 0', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <h4 className="font-system" style={{ fontSize: 15, color: '#f8fafc', margin: 0 }}>
            DATA PERSISTENCE & PORTABILITY
          </h4>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 14px' }}>
            All progress is automatically stored locally in your browser. Download an encrypted JSON snapshot or restore previous records.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={triggerExport}
              className="btn-system btn-system-primary font-system"
              style={{ fontSize: 12 }}
            >
              <Download size={15} /> EXPORT BACKUP (.JSON)
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-system font-system"
              style={{ fontSize: 12 }}
            >
              <Upload size={15} /> IMPORT BACKUP (.JSON)
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Hardware & Spec Profile */}
        <div style={{ padding: '18px 0', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Cpu size={16} color="#10b981" />
            <h4 className="font-system" style={{ fontSize: 15, color: '#f8fafc', margin: 0 }}>
              HARDWARE & ARCHITECTURE PROFILE
            </h4>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 10px' }}>
            Engineered for ultra-low latency on Windows 10, Intel i3-6006U (2.0 GHz) and 8 GB RAM.
          </p>
          <div style={{ background: 'rgba(6, 11, 26, 0.7)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 6, padding: '10px 14px', fontSize: 12, color: '#cbd5e1' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
              <div>• 3D Engines / Shaders: <span style={{ color: '#10b981' }}>Disabled (0% GPU Load)</span></div>
              <div>• Video Backgrounds: <span style={{ color: '#10b981' }}>None (0 MB Memory leak)</span></div>
              <div>• Heavy Canvas Particles: <span style={{ color: '#10b981' }}>None (Pure CSS transforms)</span></div>
              <div>• Background Polling: <span style={{ color: '#10b981' }}>Zero (Event-driven)</span></div>
            </div>
          </div>
        </div>

        {/* Reset Danger Zone */}
        <div style={{ padding: '18px 0 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={16} color="#f43f5e" />
                <h4 className="font-system" style={{ fontSize: 14, color: '#fb7185', margin: 0 }}>
                  SYSTEM PURGE & FACTORY REBOOT
                </h4>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
                Wipes all stored levels, stats, and custom quests. Cannot be undone unless you exported a backup.
              </p>
            </div>

            <button
              onClick={handleResetConfirm}
              className="btn-system btn-system-danger font-system"
              style={{ fontSize: 11 }}
            >
              <RotateCcw size={13} /> RESET PROGRESS
            </button>
          </div>
        </div>

        {/* Diagnostics & Self-Test Suite */}
        <SelfTestRunner />

      </div>
    </div>
  );
}
