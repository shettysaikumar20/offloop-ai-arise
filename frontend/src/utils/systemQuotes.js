/**
 * System Quotes & Lore Messages for OffLoop AI: ARISE
 */

export const SYSTEM_AWAKENING_QUOTES = [
  "Notification: The player has reconnected to the Real World Gateway.",
  "System: The gap between your current self and the Monarch is forged through repetition.",
  "Warning: Passive scrolling drains mana. Engage physical world quests to restore vitality.",
  "Notice: Every small rep completed in reality reverberates across the System.",
  "Announcement: Discipline is the highest tier of sorcery.",
  "System: The dungeon of modern comfort can be cleared only one deliberate step at a time.",
  "Arise: Shadows of your past discipline stand ready to march with you."
];

export function getRandomSystemQuote() {
  return SYSTEM_AWAKENING_QUOTES[Math.floor(Math.random() * SYSTEM_AWAKENING_QUOTES.length)];
}
