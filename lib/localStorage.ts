export interface GameState {
  puzzleNumber: number;
  guesses: string[];
  guessResults: Array<'correct' | 'partial' | 'incorrect'>; // Result for each guess
  revealedHints: number; // Number of hints revealed (0 = none, 1 = first hint, etc.)
  isComplete: boolean;
  isWon: boolean;
  hasPartialMatch: boolean; // Track if any guess was partially correct
}

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: { [key: number]: number }; // 1-6 guesses
}

const GAME_STATE_KEY = 'radiordle_game_state';
const STATISTICS_KEY = 'radiordle_statistics';

// Game State Management
export function getGameState(puzzleNumber: number): GameState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(GAME_STATE_KEY);
    if (!stored) return null;

    const state: any = JSON.parse(stored);

    // Return null if stored state is for a different puzzle
    if (state.puzzleNumber !== puzzleNumber) return null;

    // Migration: Add guessResults if it doesn't exist (for backward compatibility)
    if (!state.guessResults) {
      state.guessResults = [];
    }

    return state as GameState;
  } catch (error) {
    console.error('Error reading game state:', error);
    return null;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

// Statistics Management
export function getStatistics(): Statistics {
  if (typeof window === 'undefined') {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {},
    };
  }

  try {
    const stored = localStorage.getItem(STATISTICS_KEY);
    if (!stored) {
      return {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: {},
      };
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading statistics:', error);
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {},
    };
  }
}

export function saveStatistics(stats: Statistics): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STATISTICS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
}

export function updateStatistics(won: boolean, guessCount: number): void {
  const stats = getStatistics();

  stats.gamesPlayed += 1;

  if (won) {
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);

    // Update guess distribution
    stats.guessDistribution[guessCount] = (stats.guessDistribution[guessCount] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  saveStatistics(stats);
}
