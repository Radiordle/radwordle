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

/**
 * Normalizes a diagnosis string for comparison by:
 * - Converting to lowercase
 * - Removing punctuation and special characters
 * - Trimming whitespace
 */
function normalizeDiagnosis(diagnosis: string): string {
  return diagnosis
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Extracts significant words from a diagnosis (excludes common medical terms)
 */
function getSignificantWords(diagnosis: string): string[] {
  const normalized = normalizeDiagnosis(diagnosis);
  const words = normalized.split(/\s+/);

  // Filter out common medical terms that shouldn't count for partial matches
  const commonTerms = new Set([
    'of', 'the', 'a', 'an', 'with', 'without', 'and', 'or',
    'disease', 'syndrome', 'disorder', 'condition', 'injury'
  ]);

  return words.filter(word => word.length > 0 && !commonTerms.has(word));
}

/**
 * Checks if a guess matches the correct answer
 * Returns: 'correct', 'partial', or 'incorrect'
 */
export function checkAnswer(guess: string, correctAnswer: string): 'correct' | 'partial' | 'incorrect' {
  const normalizedGuess = normalizeDiagnosis(guess);
  const normalizedAnswer = normalizeDiagnosis(correctAnswer);

  // Exact match
  if (normalizedGuess === normalizedAnswer) {
    return 'correct';
  }

  // Check for partial match (common significant words)
  const guessWords = getSignificantWords(guess);
  const answerWords = getSignificantWords(correctAnswer);

  // Find common words between guess and answer
  const commonWords = guessWords.filter(word => answerWords.includes(word));

  // Partial match if they share at least one significant word
  if (commonWords.length > 0) {
    return 'partial';
  }

  return 'incorrect';
}
