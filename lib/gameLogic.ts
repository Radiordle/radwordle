export const MAX_GUESSES = 6;

export function getDayNumber(date: Date = new Date()): number {
  const gameEpoch = new Date(process.env.NEXT_PUBLIC_GAME_EPOCH || '2025-01-01');
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceEpoch = Math.floor((date.getTime() - gameEpoch.getTime()) / msPerDay);
  return daysSinceEpoch;
}

export function getTodaysPuzzleNumber(totalPuzzles: number, date: Date = new Date()): number {
  const dayNumber = getDayNumber(date);
  return (dayNumber % totalPuzzles) + 1;
}
