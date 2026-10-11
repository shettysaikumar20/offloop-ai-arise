/**
 * OffLoop AI: ARISE — Data Models & Constants
 * Pure client-side data definitions for the Solo Leveling inspired System.
 */

export const STORAGE_KEY = 'offloop_arise_v1';
export const STORAGE_VERSION = 1;

export const RANKS = {
  E: { name: 'E-Rank', label: 'E-Rank Awakened', minLevel: 1, color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)', icon: 'Shield' },
  D: { name: 'D-Rank', label: 'D-Rank Striker', minLevel: 5, color: '#22c55e', glow: 'rgba(34, 197, 94, 0.45)', icon: 'Zap' },
  C: { name: 'C-Rank', label: 'C-Rank Vanguard', minLevel: 10, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)', icon: 'Flame' },
  B: { name: 'B-Rank', label: 'B-Rank Commander', minLevel: 20, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.6)', icon: 'Award' },
  A: { name: 'A-Rank', label: 'A-Rank Sovereign', minLevel: 35, color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.65)', icon: 'Skull' },
  S: { name: 'S-Rank', label: 'S-Rank Monarch', minLevel: 50, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.85)', icon: 'Sparkles' }
};

export const STAT_INFO = {
  strength: {
    name: 'Strength (STR)',
    code: 'STR',
    desc: 'Governs physical stamina, workouts, and active bodily energy.',
    icon: 'Flame',
    color: '#f97316'
  },
  intelligence: {
    name: 'Intelligence (INT)',
    code: 'INT',
    desc: 'Governs mental acuity, continuous learning, and strategic thinking.',
    icon: 'Sparkles',
    color: '#38bdf8'
  },
  discipline: {
    name: 'Discipline (DIS)',
    code: 'DIS',
    desc: 'Governs habit adherence, resistance to distraction, and streak longevity.',
    icon: 'Shield',
    color: '#a855f7'
  },
  endurance: {
    name: 'Endurance (END)',
    code: 'END',
    desc: 'Governs sustained deep focus duration and resilience during grueling grinds.',
    icon: 'Zap',
    color: '#10b981'
  }
};

/**
 * Calculates XP required to advance to the next level.
 * Level 1 -> 2 requires 100 XP
 * Scales moderately to feel rewarding yet achievable.
 */
export function getRequiredXpForLevel(level) {
  if (level <= 1) return 100;
  return Math.floor(100 * Math.pow(1.18, level - 1));
}

/**
 * Determines Rank based on current player level.
 */
export function getRankForLevel(level) {
  if (level >= 50) return 'S';
  if (level >= 35) return 'A';
  if (level >= 20) return 'B';
  if (level >= 10) return 'C';
  if (level >= 5) return 'D';
  return 'E';
}

export const INITIAL_SHADOWS = [
  {
    id: 'shadow-tenebra',
    name: 'Tenebris',
    title: 'Blade of Conviction',
    rank: 'D',
    unlockType: 'level',
    unlockThreshold: 5,
    description: 'An echo born from your early perseverance. Manifests silent resolution.',
    perk: '+5% bonus XP on all completed quests',
    unlocked: false,
    unlockedAt: null,
    lore: 'Arisen when a hunter first rejects the comfort of the couch to face the morning cold.'
  },
  {
    id: 'shadow-umbra',
    name: 'Umbra',
    title: 'Silent Scholar',
    rank: 'C',
    unlockType: 'focus_sessions',
    unlockThreshold: 5,
    description: 'A shadowy archivist who absorbs distractions before they touch your mind.',
    perk: '+10% focus session XP and 1 extra stat point on rank-up',
    unlocked: false,
    unlockedAt: null,
    lore: 'Formed from thirty thousand seconds of pure unbroken silence.'
  },
  {
    id: 'shadow-vortex',
    name: 'Vortex',
    title: 'Temporal Sentinel',
    rank: 'B',
    unlockType: 'streak',
    unlockThreshold: 7,
    description: 'A chronomantic shadow warrior who guards your daily habit rhythm.',
    perk: 'Immunity to single-day streak degradation',
    unlocked: false,
    unlockedAt: null,
    lore: 'Commands the pulse of days and the relentless momentum of ritual.'
  },
  {
    id: 'shadow-ignis',
    name: 'Ignis',
    title: 'The Unyielding Core',
    rank: 'A',
    unlockType: 'quests_completed',
    unlockThreshold: 25,
    description: 'A raging spectral flame forged in the fires of completed obligations.',
    perk: '+15% bonus XP and +2 STR/END on boss raids',
    unlocked: false,
    unlockedAt: null,
    lore: 'Extracted from the ashes of defeated procrastination.'
  },
  {
    id: 'shadow-nocturne',
    name: 'Nocturne',
    title: 'The Void Sovereign',
    rank: 'S',
    unlockType: 'rank',
    unlockThreshold: 'S',
    description: 'The supreme shadow general. Bends reality to the will of the Awakened.',
    perk: '+25% All XP, Crown of the Monarch aura unlocked',
    unlocked: false,
    unlockedAt: null,
    lore: 'Only those who conquer the highest tiers of real-world discipline can command Nocturne.'
  }
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'ach-awakening',
    title: 'The System Awakening',
    description: 'Complete your first real-world quest and answer the call.',
    category: 'quest',
    target: 1,
    current: 0,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 150,
    icon: 'Sparkles'
  },
  {
    id: 'ach-slayer-5',
    title: 'Gate Cleaner',
    description: 'Complete 5 quests across any category.',
    category: 'quest',
    target: 5,
    current: 0,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 300,
    icon: 'Shield'
  },
  {
    id: 'ach-slayer-25',
    title: 'Veteran of the Grind',
    description: 'Complete 25 total quests.',
    category: 'quest',
    target: 25,
    current: 0,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 1000,
    icon: 'Award'
  },
  {
    id: 'ach-streak-3',
    title: 'Unwavering Stride',
    description: 'Maintain an active daily quest streak for 3 consecutive days.',
    category: 'streak',
    target: 3,
    current: 0,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 250,
    icon: 'Flame'
  },
  {
    id: 'ach-streak-7',
    title: 'Week of the Hunter',
    description: 'Achieve a 7-day uninterrupted streak.',
    category: 'streak',
    target: 7,
    current: 0,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 700,
    icon: 'Zap'
  },
  {
    id: 'ach-focus-60',
    title: 'Monastic Silence',
    description: 'Log at least 60 total minutes of deep focus timer sessions.',
    category: 'focus',
    target: 60,
    current: 0,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 400,
    icon: 'Clock'
  },
  {
    id: 'ach-focus-300',
    title: 'Domain of the Mind',
    description: 'Log 300 total minutes inside the Focus Sanctum.',
    category: 'focus',
    target: 300,
    current: 0,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 1500,
    icon: 'Zap'
  },
  {
    id: 'ach-dungeon-1',
    title: 'First Raid Cleared',
    description: 'Successfully complete any multi-phase Dungeon Challenge.',
    category: 'dungeon',
    target: 1,
    current: 0,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 500,
    icon: 'Skull'
  },
  {
    id: 'ach-level-10',
    title: 'Class Evolution',
    description: 'Attain Level 10 and ascend to C-Rank.',
    category: 'level',
    target: 10,
    current: 1,
    unlocked: false,
    unlockedAt: null,
    rewardXp: 800,
    icon: 'Sparkles'
  }
];

export const INITIAL_QUESTS = [
  {
    id: 'quest-daily-1',
    title: 'Physical Conditioning Protocol',
    description: 'Perform 60 pushups, bodyweight squats, or a brisk 20-minute physical walk. Build the vessel.',
    type: 'daily',
    difficulty: 'E',
    category: 'physical',
    statReward: 'strength',
    statBonus: 1,
    xpReward: 120,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'quest-daily-2',
    title: 'Scholar\'s Mind Fortification',
    description: 'Read high-value educational or technical material for at least 25 minutes without opening social apps.',
    type: 'daily',
    difficulty: 'D',
    category: 'mental',
    statReward: 'intelligence',
    statBonus: 1,
    xpReward: 140,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'quest-daily-3',
    title: 'Digital Severance Shield',
    description: 'Abstain from short-form reels, shorts, or algorithmic feeds for 2 continuous daytime hours.',
    type: 'daily',
    difficulty: 'D',
    category: 'discipline',
    statReward: 'discipline',
    statBonus: 1,
    xpReward: 160,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'quest-daily-4',
    title: 'Unbroken Deep Work Strike',
    description: 'Execute a 45-minute continuous focus block on your primary professional or creative objective.',
    type: 'daily',
    difficulty: 'C',
    category: 'productivity',
    statReward: 'endurance',
    statBonus: 1,
    xpReward: 200,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'quest-weekly-1',
    title: 'The Five Gates of Consistency',
    description: 'Successfully complete all daily conditioning quests for 5 days this week.',
    type: 'weekly',
    difficulty: 'B',
    category: 'discipline',
    statReward: 'discipline',
    statBonus: 3,
    xpReward: 600,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'quest-weekly-2',
    title: 'Deep Forge of Mastery',
    description: 'Ship or publish a tangible work artifact, codebase feature, or scholarly project write-up.',
    type: 'weekly',
    difficulty: 'A',
    category: 'mental',
    statReward: 'intelligence',
    statBonus: 4,
    xpReward: 850,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_DUNGEONS = [
  {
    id: 'dungeon-gate-1',
    name: 'Gate of the Cluttered Chamber',
    rank: 'D',
    timeLimitMinutes: 25,
    xpReward: 350,
    statReward: 'discipline',
    statBonus: 2,
    lore: 'A minor spatial anomaly fueled by physical entropy and disarray in your real-world room.',
    phases: [
      { id: 'p1', title: 'Phase 1: Clear the Work Desk', desc: 'Remove all plates, cups, trash, and extraneous clutter from your workspace.', completed: false },
      { id: 'p2', title: 'Phase 2: Hydration & Air Flow', desc: 'Fill fresh water bottle, open a window or adjust lighting for prime alertness.', completed: false },
      { id: 'p3', title: 'Phase 3: Digital Tab Purge', desc: 'Close all irrelevant browser tabs, chat windows, and background noise.', completed: false }
    ]
  },
  {
    id: 'dungeon-gate-2',
    name: 'Red Gate: The Procrastination Labyrinth',
    rank: 'B',
    timeLimitMinutes: 45,
    xpReward: 650,
    statReward: 'endurance',
    statBonus: 3,
    lore: 'The temperature drops as temporal paralysis takes hold. You cannot leave until the hardest pending task is struck down.',
    phases: [
      { id: 'p1', title: 'Phase 1: Identify the Dread Beast', desc: 'Write down the single task you have avoided most this week.', completed: false },
      { id: 'p2', title: 'Phase 2: Break into 3 Strike Angles', desc: 'Divide that terrifying task into 3 small, non-threatening bite-sized actions.', completed: false },
      { id: 'p3', title: 'Phase 3: Sprint 1 (20 Minutes)', desc: 'Attack Sub-Task 1 with zero pause or checking your phone.', completed: false },
      { id: 'p4', title: 'Phase 4: Decisive Deliverable', desc: 'Finish the core core deliverable and save or send the output.', completed: false }
    ]
  },
  {
    id: 'dungeon-gate-3',
    name: 'Monarch’s Citadel of Transcendent Craft',
    rank: 'S',
    timeLimitMinutes: 75,
    xpReward: 1400,
    statReward: 'intelligence',
    statBonus: 5,
    lore: 'The throne room of true deep work. Reserved only for high-stakes deep learning, architectural designs, and intense focus.',
    phases: [
      { id: 'p1', title: 'Phase 1: Total Sensory Lockdown', desc: 'Silence phone completely, put in another room, engage do-not-disturb on desktop.', completed: false },
      { id: 'p2', title: 'Phase 2: Establish the Objective Blueprint', desc: 'Clearly define the exact outcome that constitutes victory today.', completed: false },
      { id: 'p3', title: 'Phase 3: Deep Work Surge Part I', desc: '35 minutes of uninterrupted deep synthesis, writing, or coding.', completed: false },
      { id: 'p4', title: 'Phase 4: Tactical Review & Recharge', desc: '5 minutes standing, stretching eyes into the distance, zero social media.', completed: false },
      { id: 'p5', title: 'Phase 5: The Final Strike', desc: '30 minutes of unrelenting execution to finalize the milestone.', completed: false }
    ]
  }
];

export const DEFAULT_PLAYER_STATE = {
  name: 'Sung Jin-Woo (Player)',
  title: 'The Reawakened One',
  level: 1,
  currentXp: 0,
  rank: 'E',
  statPoints: 3,
  stats: {
    strength: 10,
    intelligence: 10,
    discipline: 10,
    endurance: 10
  },
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  lastResetDate: new Date().toISOString().split('T')[0],
  totalQuestsCompleted: 0,
  totalFocusMinutes: 0,
  totalDungeonsCleared: 0,
  soundEnabled: true,
  theme: 'system-dark'
};
