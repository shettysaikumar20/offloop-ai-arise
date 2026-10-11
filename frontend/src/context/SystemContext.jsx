import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getRequiredXpForLevel,
  getRankForLevel,
  RANKS,
  STAT_INFO
} from '../types/models.js';
import {
  loadStoredState,
  saveStoredState,
  exportBackup,
  validateImportedData,
  getInitialFullState
} from '../utils/storage.js';
import { playSystemBeep } from '../utils/sound.js';

const SystemContext = createContext(null);

export function SystemProvider({ children }) {
  const [state, setState] = useState(() => loadStoredState());
  const [notifications, setNotifications] = useState([]);
  const [levelUpModal, setLevelUpModal] = useState(null);
  const [activeDungeonSession, setActiveDungeonSession] = useState(null);

  // Auto-persist whenever full state changes
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  // Push System Notification
  const notify = useCallback((title, message, type = 'info', meta = null) => {
    const id = 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newNotif = {
      id,
      title,
      message,
      type, // 'info', 'quest', 'levelup', 'rankup', 'achievement', 'shadow', 'warning'
      timestamp: new Date().toLocaleTimeString(),
      meta
    };

    setNotifications(prev => [newNotif, ...prev.slice(0, 7)]);

    // Sound effect
    if (state.player.soundEnabled) {
      if (type === 'levelup') playSystemBeep('levelup', true);
      else if (type === 'rankup') playSystemBeep('rankup', true);
      else if (type === 'quest' || type === 'achievement' || type === 'shadow') playSystemBeep('complete', true);
      else playSystemBeep('notification', true);
    }

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, [state.player.soundEnabled]);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Check and evaluate Shadow unlocks
  const checkShadowUnlocks = useCallback((player, completedQuestsCount, focusSessionsCount) => {
    let shadowUnlockedList = [];
    const updatedShadows = state.shadows.map(shadow => {
      if (shadow.unlocked) return shadow;

      let shouldUnlock = false;
      if (shadow.unlockType === 'level' && player.level >= shadow.unlockThreshold) {
        shouldUnlock = true;
      } else if (shadow.unlockType === 'focus_sessions' && focusSessionsCount >= shadow.unlockThreshold) {
        shouldUnlock = true;
      } else if (shadow.unlockType === 'streak' && player.streakDays >= shadow.unlockThreshold) {
        shouldUnlock = true;
      } else if (shadow.unlockType === 'quests_completed' && completedQuestsCount >= shadow.unlockThreshold) {
        shouldUnlock = true;
      } else if (shadow.unlockType === 'rank' && player.rank === shadow.unlockThreshold) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        shadowUnlockedList.push(shadow);
        return {
          ...shadow,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
      }
      return shadow;
    });

    return { updatedShadows, shadowUnlockedList };
  }, [state.shadows]);

  // Check and evaluate Achievements
  const checkAchievements = useCallback((player, questsCount, focusMinutes, dungeonsCount) => {
    let unlockedAchs = [];
    let bonusXpFromAchs = 0;

    const updatedAchs = state.achievements.map(ach => {
      if (ach.unlocked) return ach;

      let currentVal = ach.current;
      if (ach.category === 'quest') currentVal = questsCount;
      if (ach.category === 'streak') currentVal = player.streakDays;
      if (ach.category === 'focus') currentVal = focusMinutes;
      if (ach.category === 'dungeon') currentVal = dungeonsCount;
      if (ach.category === 'level') currentVal = player.level;

      const isComplete = currentVal >= ach.target;
      if (isComplete) {
        unlockedAchs.push(ach);
        bonusXpFromAchs += ach.rewardXp;
        return {
          ...ach,
          current: currentVal,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
      }
      return {
        ...ach,
        current: currentVal
      };
    });

    return { updatedAchs, unlockedAchs, bonusXpFromAchs };
  }, [state.achievements]);

  // Core Level Up & XP Calculation Engine
  const addPlayerXp = useCallback((amount, source = 'Quest') => {
    if (amount <= 0) return;

    setState(prev => {
      let currentLevel = prev.player.level;
      let currentXp = prev.player.currentXp + amount;
      let currentStatPoints = prev.player.statPoints;
      let initialRank = prev.player.rank;
      let levelsGained = 0;

      while (true) {
        const required = getRequiredXpForLevel(currentLevel);
        if (currentXp >= required) {
          currentXp -= required;
          currentLevel += 1;
          currentStatPoints += 3; // +3 stat points per level!
          levelsGained += 1;
        } else {
          break;
        }
      }

      const newRank = getRankForLevel(currentLevel);
      const rankPromoted = newRank !== initialRank;

      const updatedPlayer = {
        ...prev.player,
        level: currentLevel,
        currentXp,
        rank: newRank,
        statPoints: currentStatPoints
      };

      // Trigger visual modal if level up happened
      if (levelsGained > 0) {
        setTimeout(() => {
          setLevelUpModal({
            oldLevel: prev.player.level,
            newLevel: currentLevel,
            levelsGained,
            statPointsGained: levelsGained * 3,
            oldRank: initialRank,
            newRank,
            rankPromoted
          });
          notify(
            'SYSTEM AWAKENING: LEVEL UP',
            `You ascended to Level ${currentLevel}! (+${levelsGained * 3} Stat Points)`,
            'levelup'
          );
          if (rankPromoted) {
            setTimeout(() => {
              notify(
                'RANK PROMOTION: RE-EVALUATION COMPLETE',
                `The System has re-evaluated your mana core: You are now ${RANKS[newRank].label}!`,
                'rankup'
              );
            }, 800);
          }
        }, 100);
      }

      const newLog = {
        id: 'log-' + Date.now(),
        type: 'xp',
        message: `+${amount} XP gained from ${source}.`,
        timestamp: new Date().toISOString()
      };

      return {
        ...prev,
        player: updatedPlayer,
        activityLog: [newLog, ...prev.activityLog.slice(0, 49)]
      };
    });
  }, [notify]);

  // Allocate Stat Points
  const allocateStat = useCallback((statKey) => {
    setState(prev => {
      if (prev.player.statPoints <= 0) return prev;
      if (!prev.player.stats[statKey] && prev.player.stats[statKey] !== 0) return prev;

      const updatedPlayer = {
        ...prev.player,
        statPoints: prev.player.statPoints - 1,
        stats: {
          ...prev.player.stats,
          [statKey]: prev.player.stats[statKey] + 1
        }
      };

      notify(
        'STAT ATTRIBUTED',
        `${STAT_INFO[statKey].name} reinforced (+1). Remaining Points: ${updatedPlayer.statPoints}`,
        'info'
      );

      return {
        ...prev,
        player: updatedPlayer
      };
    });
  }, [notify]);

  // Complete / Uncomplete Quest
  const toggleQuestCompletion = useCallback((questId) => {
    setState(prev => {
      const targetQuest = prev.quests.find(q => q.id === questId);
      if (!targetQuest) return prev;

      const isNowCompleted = !targetQuest.completed;
      const updatedQuests = prev.quests.map(q => {
        if (q.id === questId) {
          return {
            ...q,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? new Date().toISOString() : null
          };
        }
        return q;
      });

      if (!isNowCompleted) {
        // Reverting completion
        notify('QUEST RESTORED', `"${targetQuest.title}" marked incomplete.`, 'info');
        return {
          ...prev,
          quests: updatedQuests
        };
      }

      // Check shadow perks: e.g. Tenebris gives +5% bonus XP
      let bonusXpPercent = 0;
      const tenebris = prev.shadows.find(s => s.id === 'shadow-tenebra');
      if (tenebris && tenebris.unlocked) bonusXpPercent += 0.05;
      const ignis = prev.shadows.find(s => s.id === 'shadow-ignis');
      if (ignis && ignis.unlocked) bonusXpPercent += 0.15;
      const nocturne = prev.shadows.find(s => s.id === 'shadow-nocturne');
      if (nocturne && nocturne.unlocked) bonusXpPercent += 0.25;

      const finalXp = Math.round(targetQuest.xpReward * (1 + bonusXpPercent));

      // Stat bonus
      const statBonus = targetQuest.statBonus || 1;
      const statKey = targetQuest.statReward;
      const updatedStats = { ...prev.player.stats };
      if (statKey && updatedStats[statKey] !== undefined) {
        updatedStats[statKey] += statBonus;
      }

      const newCompletedCount = prev.player.totalQuestsCompleted + 1;

      // Update streak
      const todayStr = new Date().toISOString().split('T')[0];
      let newStreak = prev.player.streakDays;
      if (prev.player.lastActiveDate !== todayStr) {
        newStreak += 1;
      }

      let updatedPlayer = {
        ...prev.player,
        stats: updatedStats,
        streakDays: newStreak,
        lastActiveDate: todayStr,
        totalQuestsCompleted: newCompletedCount
      };

      // Check shadow unlocks
      const { updatedShadows, shadowUnlockedList } = checkShadowUnlocks(
        updatedPlayer,
        newCompletedCount,
        prev.focusHistory.length
      );

      // Check achievements
      const { updatedAchs, unlockedAchs, bonusXpFromAchs } = checkAchievements(
        updatedPlayer,
        newCompletedCount,
        prev.player.totalFocusMinutes,
        prev.player.totalDungeonsCleared
      );

      // Notify quest complete
      notify(
        'QUEST CLEARED!',
        `"${targetQuest.title}" accomplished! +${finalXp} XP ${statKey ? `& +${statBonus} ${STAT_INFO[statKey].code}` : ''}`,
        'quest'
      );

      // Notify any unlocked shadows
      shadowUnlockedList.forEach(shadow => {
        setTimeout(() => {
          notify(
            'SHADOW EXTRACTED!',
            `Echo [${shadow.name} — ${shadow.title}] has yielded to your sovereign authority!`,
            'shadow'
          );
        }, 500);
      });

      // Notify any unlocked achievements
      unlockedAchs.forEach(ach => {
        setTimeout(() => {
          notify(
            'ACHIEVEMENT UNLOCKED!',
            `[${ach.title}] — ${ach.description} (+${ach.rewardXp} XP)`,
            'achievement'
          );
        }, 800);
      });

      const totalXpToGive = finalXp + bonusXpFromAchs;

      const newLog = {
        id: 'log-' + Date.now(),
        type: 'quest',
        message: `Cleared quest: "${targetQuest.title}" (+${finalXp} XP)`,
        timestamp: new Date().toISOString()
      };

      // Schedule XP addition
      setTimeout(() => {
        addPlayerXp(totalXpToGive, `Quest "${targetQuest.title}"`);
      }, 50);

      return {
        ...prev,
        player: updatedPlayer,
        quests: updatedQuests,
        shadows: updatedShadows,
        achievements: updatedAchs,
        activityLog: [newLog, ...prev.activityLog.slice(0, 49)]
      };
    });
  }, [notify, checkShadowUnlocks, checkAchievements, addPlayerXp]);

  // Create custom quest
  const addCustomQuest = useCallback((newQuest) => {
    const questItem = {
      id: 'quest-custom-' + Date.now(),
      title: newQuest.title.trim(),
      description: newQuest.description.trim(),
      type: newQuest.type || 'daily',
      difficulty: newQuest.difficulty || 'D',
      category: newQuest.category || 'productivity',
      statReward: newQuest.statReward || 'discipline',
      statBonus: parseInt(newQuest.statBonus, 10) || 1,
      xpReward: parseInt(newQuest.xpReward, 10) || 150,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      quests: [questItem, ...prev.quests]
    }));

    notify('NEW MISSION DETECTED', `Quest "${questItem.title}" has been registered in the System.`, 'info');
  }, [notify]);

  // Delete quest
  const deleteQuest = useCallback((questId) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.filter(q => q.id !== questId)
    }));
    notify('QUEST ABANDONED', 'Quest removed from System logs.', 'info');
  }, [notify]);

  // Daily Quests Reset
  const resetDailyQuests = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setState(prev => {
      const resetList = prev.quests.map(q => {
        if (q.type === 'daily') {
          return { ...q, completed: false, completedAt: null };
        }
        return q;
      });

      return {
        ...prev,
        quests: resetList,
        player: {
          ...prev.player,
          lastResetDate: todayStr
        }
      };
    });

    notify(
      'DAILY SYSTEM RESET',
      'The morning sun rises. All daily conditioning gates have been reset.',
      'info'
    );
  }, [notify]);

  // Log completed Focus session
  const completeFocusSession = useCallback((minutes, taskName = 'Deep Focus Block') => {
    if (minutes <= 0) return;

    // Award 25 XP per 10 minutes of focus
    let focusXp = Math.max(25, Math.round((minutes / 10) * 25));

    // Shadow perk: Umbra gives +10% focus session XP
    const umbra = state.shadows.find(s => s.id === 'shadow-umbra');
    if (umbra && umbra.unlocked) {
      focusXp = Math.round(focusXp * 1.1);
    }

    const sessionRecord = {
      id: 'focus-' + Date.now(),
      taskName,
      minutes,
      xpEarned: focusXp,
      timestamp: new Date().toISOString()
    };

    setState(prev => {
      const newTotalMinutes = prev.player.totalFocusMinutes + minutes;
      const newFocusHistory = [sessionRecord, ...prev.focusHistory];

      let updatedPlayer = {
        ...prev.player,
        totalFocusMinutes: newTotalMinutes,
        stats: {
          ...prev.player.stats,
          endurance: prev.player.stats.endurance + (minutes >= 45 ? 1 : 0)
        }
      };

      // Check shadow unlocks (e.g. Umbra unlocks at 5 focus sessions)
      const { updatedShadows, shadowUnlockedList } = checkShadowUnlocks(
        updatedPlayer,
        prev.player.totalQuestsCompleted,
        newFocusHistory.length
      );

      // Check achievements (e.g. Monastic Silence 60 mins)
      const { updatedAchs, unlockedAchs, bonusXpFromAchs } = checkAchievements(
        updatedPlayer,
        prev.player.totalQuestsCompleted,
        newTotalMinutes,
        prev.player.totalDungeonsCleared
      );

      shadowUnlockedList.forEach(shadow => {
        setTimeout(() => {
          notify('SHADOW EXTRACTED!', `Echo [${shadow.name}] has answered your mental focus.`, 'shadow');
        }, 500);
      });

      unlockedAchs.forEach(ach => {
        setTimeout(() => {
          notify('ACHIEVEMENT UNLOCKED!', `[${ach.title}] (+${ach.rewardXp} XP)`, 'achievement');
        }, 800);
      });

      notify(
        'FOCUS SANCTUM CONCLUDED',
        `Completed ${minutes} minutes of deep flow. +${focusXp} XP awarded.`,
        'quest'
      );

      setTimeout(() => {
        addPlayerXp(focusXp + bonusXpFromAchs, `Focus Session (${minutes}m)`);
      }, 50);

      return {
        ...prev,
        player: updatedPlayer,
        shadows: updatedShadows,
        achievements: updatedAchs,
        focusHistory: newFocusHistory
      };
    });
  }, [state.shadows, notify, checkShadowUnlocks, checkAchievements, addPlayerXp]);

  // Dungeon Challenge completion
  const clearDungeonChallenge = useCallback((dungeonId) => {
    setState(prev => {
      const dungeon = prev.dungeons.find(d => d.id === dungeonId);
      if (!dungeon) return prev;

      const newDungeonsCleared = prev.player.totalDungeonsCleared + 1;
      const statKey = dungeon.statReward;
      const statBonus = dungeon.statBonus || 2;

      const updatedStats = { ...prev.player.stats };
      if (statKey && updatedStats[statKey] !== undefined) {
        updatedStats[statKey] += statBonus;
      }

      let updatedPlayer = {
        ...prev.player,
        totalDungeonsCleared: newDungeonsCleared,
        stats: updatedStats
      };

      const { updatedAchs, unlockedAchs, bonusXpFromAchs } = checkAchievements(
        updatedPlayer,
        prev.player.totalQuestsCompleted,
        prev.player.totalFocusMinutes,
        newDungeonsCleared
      );

      notify(
        'DUNGEON CONQUERED: BOSS SLAIN!',
        `Gate [${dungeon.name}] cleared! +${dungeon.xpReward} XP & +${statBonus} ${STAT_INFO[statKey].code}!`,
        'quest'
      );

      unlockedAchs.forEach(ach => {
        setTimeout(() => {
          notify('ACHIEVEMENT UNLOCKED!', `[${ach.title}] (+${ach.rewardXp} XP)`, 'achievement');
        }, 700);
      });

      setTimeout(() => {
        addPlayerXp(dungeon.xpReward + bonusXpFromAchs, `Dungeon "${dungeon.name}"`);
      }, 50);

      return {
        ...prev,
        player: updatedPlayer,
        achievements: updatedAchs,
        activityLog: [
          {
            id: 'log-' + Date.now(),
            type: 'dungeon',
            message: `Cleared Dungeon Gate: "${dungeon.name}" (+${dungeon.xpReward} XP)`,
            timestamp: new Date().toISOString()
          },
          ...prev.activityLog.slice(0, 49)
        ]
      };
    });
  }, [notify, checkAchievements, addPlayerXp]);

  // Toggle audio
  const toggleSound = useCallback(() => {
    setState(prev => {
      const updated = {
        ...prev,
        player: { ...prev.player, soundEnabled: !prev.player.soundEnabled }
      };
      if (updated.player.soundEnabled) {
        playSystemBeep('notification', true);
      }
      return updated;
    });
  }, []);

  // Update Hunter Profile Name/Title
  const updateHunterProfile = useCallback((name, title) => {
    setState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        name: name.trim() || prev.player.name,
        title: title.trim() || prev.player.title
      }
    }));
    notify('HUNTER REGISTRATION UPDATED', 'Identification parameters updated in System database.', 'info');
  }, [notify]);

  // Backup & Import
  const triggerExport = useCallback(() => {
    const success = exportBackup(state);
    if (success) {
      notify('SYSTEM BACKUP EXPORTED', 'Hunter telemetry downloaded as JSON.', 'info');
    }
    return success;
  }, [state, notify]);

  const triggerImport = useCallback((jsonData) => {
    if (!validateImportedData(jsonData)) {
      notify('IMPORT REJECTED', 'Corrupted or incompatible System backup format.', 'warning');
      return false;
    }
    const validated = {
      ...getInitialFullState(),
      ...jsonData,
      player: { ...DEFAULT_PLAYER_STATE, ...(jsonData.player || {}) }
    };
    setState(validated);
    saveStoredState(validated);
    notify('DATA RESTORED', 'System timeline successfully aligned with imported archive.', 'quest');
    return true;
  }, [notify]);

  const resetAllProgress = useCallback(() => {
    const fresh = getInitialFullState();
    setState(fresh);
    saveStoredState(fresh);
    notify('SYSTEM REBOOT', 'All parameters re-initialized to Level 1 Awakened status.', 'warning');
  }, [notify]);

  const value = useMemo(() => ({
    state,
    notifications,
    dismissNotification,
    levelUpModal,
    setLevelUpModal,
    activeDungeonSession,
    setActiveDungeonSession,
    addPlayerXp,
    allocateStat,
    toggleQuestCompletion,
    addCustomQuest,
    deleteQuest,
    resetDailyQuests,
    completeFocusSession,
    clearDungeonChallenge,
    toggleSound,
    updateHunterProfile,
    triggerExport,
    triggerImport,
    resetAllProgress,
    notify
  }), [
    state,
    notifications,
    dismissNotification,
    levelUpModal,
    activeDungeonSession,
    addPlayerXp,
    allocateStat,
    toggleQuestCompletion,
    addCustomQuest,
    deleteQuest,
    resetDailyQuests,
    completeFocusSession,
    clearDungeonChallenge,
    toggleSound,
    updateHunterProfile,
    triggerExport,
    triggerImport,
    resetAllProgress,
    notify
  ]);

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return ctx;
}
