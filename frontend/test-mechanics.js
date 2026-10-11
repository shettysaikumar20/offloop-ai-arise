/**
 * Automated Test Runner for OffLoop AI: ARISE System Mechanics
 * Runs in Node.js to verify core state transitions, calculations, and rules.
 */

import { getRequiredXpForLevel, getRankForLevel, RANKS, STAT_INFO, INITIAL_QUESTS, INITIAL_DUNGEONS, INITIAL_SHADOWS, INITIAL_ACHIEVEMENTS } from './src/types/models.js';
import { validateImportedData, getInitialFullState } from './src/utils/storage.js';

console.log('====================================================');
console.log('⚡ STARTING OFFLOOP AI: ARISE AUTOMATED TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${testName} ${details ? `(${details})` : ''}`);
  } else {
    console.error(`❌ [FAIL] ${testName} ${details ? `(${details})` : ''}`);
  }
}

// 1. TEST: Rank Progression Ladder
const r1 = getRankForLevel(1);
const r4 = getRankForLevel(4);
const r5 = getRankForLevel(5);
const r9 = getRankForLevel(9);
const r10 = getRankForLevel(10);
const r20 = getRankForLevel(20);
const r35 = getRankForLevel(35);
const r50 = getRankForLevel(50);

assert(r1 === 'E' && r4 === 'E', 'Level 1-4 resolves to E-Rank', `L1=${r1}, L4=${r4}`);
assert(r5 === 'D' && r9 === 'D', 'Level 5-9 resolves to D-Rank', `L5=${r5}, L9=${r9}`);
assert(r10 === 'C', 'Level 10 resolves to C-Rank', `L10=${r10}`);
assert(r20 === 'B', 'Level 20 resolves to B-Rank', `L20=${r20}`);
assert(r35 === 'A', 'Level 35 resolves to A-Rank', `L35=${r35}`);
assert(r50 === 'S', 'Level 50 resolves to S-Rank Monarch', `L50=${r50}`);

// 2. TEST: Required XP Formula
const xp1 = getRequiredXpForLevel(1);
const xp2 = getRequiredXpForLevel(2);
const xp5 = getRequiredXpForLevel(5);
const xp10 = getRequiredXpForLevel(10);

assert(xp1 === 100, 'Level 1 requires 100 XP to advance', `xp=${xp1}`);
assert(xp2 > xp1, 'Level 2 requires more XP than Level 1', `xp2=${xp2} > xp1=${xp1}`);
assert(xp5 > xp2 && xp10 > xp5, 'XP requirements scale consistently across levels', `xp5=${xp5}, xp10=${xp10}`);

// 3. TEST: Level-Up & Multi-Level Overflow Simulation
function simulateXpGain(player, xpToAdd) {
  let level = player.level;
  let currentXp = player.currentXp + xpToAdd;
  let statPoints = player.statPoints;
  let levelsGained = 0;

  while (true) {
    const req = getRequiredXpForLevel(level);
    if (currentXp >= req) {
      currentXp -= req;
      level += 1;
      statPoints += 3;
      levelsGained += 1;
    } else {
      break;
    }
  }

  const rank = getRankForLevel(level);
  return { ...player, level, currentXp, statPoints, rank, levelsGained };
}

const initialPlayer = { level: 1, currentXp: 0, statPoints: 0, rank: 'E' };
const singleLevelUp = simulateXpGain(initialPlayer, 100);
assert(singleLevelUp.level === 2 && singleLevelUp.statPoints === 3, '100 XP triggers Level 2 and awards +3 stat points', `Lvl=${singleLevelUp.level}, Pts=${singleLevelUp.statPoints}`);

// Multi-level surge test (giving 2,000 XP)
const surgeLevelUp = simulateXpGain(initialPlayer, 2000);
assert(surgeLevelUp.level >= 10, '2000 XP ascends player to Level 10+ and C-Rank', `Lvl=${surgeLevelUp.level}, Rank=${surgeLevelUp.rank}, Pts=${surgeLevelUp.statPoints}`);

// 4. TEST: Stat Point Allocation
function simulateStatAllocation(player, statKey) {
  if (player.statPoints <= 0) return player;
  return {
    ...player,
    statPoints: player.statPoints - 1,
    stats: {
      ...player.stats,
      [statKey]: (player.stats[statKey] || 10) + 1
    }
  };
}

const playerWithPoints = { statPoints: 3, stats: { strength: 10, intelligence: 10, discipline: 10, endurance: 10 } };
const allocated = simulateStatAllocation(playerWithPoints, 'strength');
assert(allocated.statPoints === 2 && allocated.stats.strength === 11, 'Allocating point decrements available points and increases STR', `Pts=${allocated.statPoints}, STR=${allocated.stats.strength}`);

// 5. TEST: Starter Quests & Dungeon Definitions
assert(INITIAL_QUESTS.length >= 6, 'Initial quest library populated with dailies and weeklies', `Count=${INITIAL_QUESTS.length}`);
assert(INITIAL_DUNGEONS.length === 3, 'Three multi-phase Dungeon Gates defined', `Gates=${INITIAL_DUNGEONS.map(d => d.name).join(', ')}`);
assert(INITIAL_SHADOWS.length === 5, 'Five original Shadow Companions configured', `Shadows=${INITIAL_SHADOWS.map(s => s.name).join(', ')}`);
assert(INITIAL_ACHIEVEMENTS.length >= 8, 'Hunter Feats / Achievements library defined', `Count=${INITIAL_ACHIEVEMENTS.length}`);

// 6. TEST: Storage Validation & Serialization
const fullState = getInitialFullState();
assert(validateImportedData(fullState) === true, 'Full state passes JSON import schema validation');
assert(validateImportedData({}) === false, 'Empty payload fails validation');
assert(validateImportedData(null) === false, 'Null payload safely rejected');

// 7. TEST: Shadow Threshold Evaluation
function evaluateShadows(shadows, player, questsCount, focusCount) {
  return shadows.map(shadow => {
    let shouldUnlock = false;
    if (shadow.unlockType === 'level' && player.level >= shadow.unlockThreshold) shouldUnlock = true;
    if (shadow.unlockType === 'focus_sessions' && focusCount >= shadow.unlockThreshold) shouldUnlock = true;
    if (shadow.unlockType === 'streak' && player.streakDays >= shadow.unlockThreshold) shouldUnlock = true;
    if (shadow.unlockType === 'quests_completed' && questsCount >= shadow.unlockThreshold) shouldUnlock = true;
    if (shadow.unlockType === 'rank' && player.rank === shadow.unlockThreshold) shouldUnlock = true;
    return { ...shadow, unlocked: shouldUnlock };
  });
}

const evaluated = evaluateShadows(INITIAL_SHADOWS, { level: 5, rank: 'D', streakDays: 7 }, 25, 5);
const unlockedNames = evaluated.filter(s => s.unlocked).map(s => s.name);
assert(unlockedNames.includes('Tenebris'), 'Tenebris extracts at Level 5');
assert(unlockedNames.includes('Umbra'), 'Umbra extracts at 5 Focus Sessions');
assert(unlockedNames.includes('Vortex'), 'Vortex extracts at 7-Day Streak');
assert(unlockedNames.includes('Ignis'), 'Ignis extracts at 25 Quests Completed');

console.log('\n====================================================');
console.log(`🏁 TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED (${totalTests - passedTests} FAILED)`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
