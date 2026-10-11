/**
 * OffLoop AI: ARISE — LocalStorage Manager
 * Handles robust schema validation, persistence, export, and import.
 */

import {
  STORAGE_KEY,
  STORAGE_VERSION,
  DEFAULT_PLAYER_STATE,
  INITIAL_QUESTS,
  INITIAL_DUNGEONS,
  INITIAL_SHADOWS,
  INITIAL_ACHIEVEMENTS
} from '../types/models.js';

export function getInitialFullState() {
  return {
    version: STORAGE_VERSION,
    player: { ...DEFAULT_PLAYER_STATE },
    quests: [...INITIAL_QUESTS],
    dungeons: [...INITIAL_DUNGEONS],
    shadows: [...INITIAL_SHADOWS],
    achievements: [...INITIAL_ACHIEVEMENTS],
    focusHistory: [],
    activityLog: [
      {
        id: 'log-awakening',
        type: 'system',
        message: 'The System has chosen you. Player reawakened.',
        timestamp: new Date().toISOString()
      }
    ]
  };
}

export function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = getInitialFullState();
      saveStoredState(fresh);
      return fresh;
    }

    const parsed = JSON.parse(raw);

    // Schema validation and version check
    if (!parsed || typeof parsed !== 'object') {
      console.warn('Storage corrupted, resetting to fresh state');
      const fresh = getInitialFullState();
      saveStoredState(fresh);
      return fresh;
    }

    // Merge with defaults to guarantee all expected keys exist even after schema updates
    const initial = getInitialFullState();
    const validatedState = {
      version: STORAGE_VERSION,
      player: { ...initial.player, ...(parsed.player || {}) },
      quests: Array.isArray(parsed.quests) ? parsed.quests : initial.quests,
      dungeons: Array.isArray(parsed.dungeons) ? parsed.dungeons : initial.dungeons,
      shadows: Array.isArray(parsed.shadows) ? parsed.shadows : initial.shadows,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : initial.achievements,
      focusHistory: Array.isArray(parsed.focusHistory) ? parsed.focusHistory : [],
      activityLog: Array.isArray(parsed.activityLog) ? parsed.activityLog : initial.activityLog
    };

    return validatedState;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return getInitialFullState();
  }
}

export function saveStoredState(state) {
  try {
    const payload = JSON.stringify({
      ...state,
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function exportBackup(state) {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `offloop_arise_backup_${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (err) {
    console.error('Export failed:', err);
    return false;
  }
}

export function validateImportedData(data) {
  if (!data || typeof data !== 'object') return false;
  if (!data.player || typeof data.player !== 'object') return false;
  if (!Array.isArray(data.quests)) return false;
  return true;
}
