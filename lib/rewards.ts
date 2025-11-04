import { useStore } from './store';

export const REWARD_AMOUNTS = {
  buddyChallenge: 50,
  voiceRoom: 25,
  streak7: 100,
  streak30: 500,
  levelUp: 200,
  sessionComplete: 20,
  voiceRoomJoin: 10,
  inviteAccepted: 15,
  voiceRoom30Min: 25,
} as const;

export interface RewardNotification {
  type: 'gems' | 'streak' | 'levelUp' | 'achievement';
  amount?: number;
  message: string;
  icon: string;
  isBig?: boolean;
}

/**
 * Award gems to user and trigger notification
 */
export function awardGems(userId: number, amount: number, reason: string): RewardNotification {
  const store = useStore.getState();
  const currentRewards = store.rewards;
  
  store.updateRewards({
    gems: currentRewards.gems + amount,
    points: currentRewards.points + amount * 2, // 2 points per gem
  });

  return {
    type: 'gems',
    amount,
    message: `💎 +${amount} gems - ${reason}`,
    icon: '💎',
  };
}

// Track which streak milestones have been awarded to prevent duplicates
const awardedStreaks = new Set<string>();

/**
 * Check and award streak milestones
 */
export function checkStreak(userId: number, currentStreak: number): RewardNotification | null {
  const streakKey = `${userId}-${currentStreak}`;
  
  // Prevent duplicate awards
  if (awardedStreaks.has(streakKey)) {
    return null;
  }
  
  const store = useStore.getState();
  
  if (currentStreak === 7) {
    awardedStreaks.add(streakKey);
    awardGems(userId, REWARD_AMOUNTS.streak7, '7 day streak milestone!');
    return {
      type: 'streak',
      amount: REWARD_AMOUNTS.streak7,
      message: `🔥 7 day streak unlocked! +${REWARD_AMOUNTS.streak7} gems`,
      icon: '🔥',
      isBig: true,
    };
  }
  
  if (currentStreak === 30) {
    awardedStreaks.add(streakKey);
    awardGems(userId, REWARD_AMOUNTS.streak30, '30 day streak milestone!');
    return {
      type: 'streak',
      amount: REWARD_AMOUNTS.streak30,
      message: `🔥 30 day streak unlocked! +${REWARD_AMOUNTS.streak30} gems`,
      icon: '🔥',
      isBig: true,
    };
  }
  
  return null;
}

/**
 * Calculate level based on total points
 * Level formula: level = floor(points / 1000) + 1
 */
export function calculateLevel(points: number): number {
  return Math.floor(points / 1000) + 1;
}

/**
 * Calculate progress to next level (0-100)
 */
export function calculateLevelProgress(points: number): { level: number; progress: number; nextLevel: number } {
  const level = calculateLevel(points);
  const pointsForCurrentLevel = (level - 1) * 1000;
  const pointsForNextLevel = level * 1000;
  const progress = ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
  
  return {
    level,
    progress: Math.min(100, Math.max(0, progress)),
    nextLevel: level + 1,
  };
}

/**
 * Check if user leveled up and award gems
 */
export function checkLevelUp(userId: number, previousPoints: number, currentPoints: number): RewardNotification | null {
  const previousLevel = calculateLevel(previousPoints);
  const currentLevel = calculateLevel(currentPoints);
  
  if (currentLevel > previousLevel) {
    awardGems(userId, REWARD_AMOUNTS.levelUp, `Level ${currentLevel} unlocked!`);
    return {
      type: 'levelUp',
      amount: REWARD_AMOUNTS.levelUp,
      message: `⭐ Level ${currentLevel} unlocked! +${REWARD_AMOUNTS.levelUp} gems`,
      icon: '⭐',
      isBig: true,
    };
  }
  
  return null;
}

/**
 * Award achievement
 */
export function awardAchievement(userId: number, achievementName: string, message: string): RewardNotification {
  const store = useStore.getState();
  const currentRewards = store.rewards;
  
  // Award gems for achievements
  const achievementGems = 50;
  store.updateRewards({
    gems: currentRewards.gems + achievementGems,
    points: currentRewards.points + achievementGems * 2,
  });

  return {
    type: 'achievement',
    amount: achievementGems,
    message: `🏆 ${message}`,
    icon: '🏆',
    isBig: true,
  };
}

