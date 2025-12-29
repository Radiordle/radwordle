import { getTotalPuzzleCount, getPuzzleByNumber, getHintsForPuzzle, getAllConditions } from '@/lib/supabase';
import { getTodaysPuzzleNumber } from '@/lib/gameLogic';
import Image from 'next/image';

export default async function Home() {
  try {
    const totalPuzzles = await getTotalPuzzleCount();
    const todaysPuzzleNumber = getTodaysPuzzleNumber(totalPuzzles);
    const puzzle = await getPuzzleByNumber(todaysPuzzleNumber);
    const hints = await getHintsForPuzzle(puzzle.id);
    const conditions = await getAllConditions();

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            RadWordle Test Page
          </h1>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              ✅ Supabase Connected
            </h2>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              📊 Database Stats
            </h2>
            <ul className="space-y-2 text-lg">
              <li className="text-zinc-700 dark:text-zinc-300">
                Total Puzzles: <span className="font-semibold">{totalPuzzles}</span>
              </li>
              <li className="text-zinc-700 dark:text-zinc-300">
                Total Conditions: <span className="font-semibold">{conditions.length}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              🎯 Today&apos;s Puzzle (#{todaysPuzzleNumber})
            </h2>
            <div className="space-y-4">
              <div className="text-lg">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Answer: <span className="font-semibold">{puzzle.answer}</span>
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Difficulty: <span className="font-semibold capitalize">{puzzle.difficulty}</span>
                </p>
              </div>
              {puzzle.image_url && (
                <div className="mt-4">
                  <p className="text-zinc-700 dark:text-zinc-300 mb-2 font-medium">Image:</p>
                  <div className="relative w-full aspect-[4/3] max-w-2xl bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
                    <Image
                      src={puzzle.image_url}
                      alt={`Puzzle ${puzzle.puzzle_number}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              💡 Hints ({hints.length})
            </h2>
            <div className="space-y-4">
              {hints.map((hint, index) => (
                <div key={hint.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {index + 1}. [{hint.content_type}]
                  </p>
                  {hint.hint_text && (
                    <p className="text-zinc-700 dark:text-zinc-300 mt-1">
                      {hint.hint_text}
                    </p>
                  )}
                  {hint.image_url && (
                    <div className="mt-2">
                      <div className="relative w-full aspect-[4/3] max-w-md bg-zinc-100 dark:bg-zinc-700 rounded overflow-hidden">
                        <Image
                          src={hint.image_url}
                          alt={hint.image_caption || `Hint ${index + 1}`}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      {hint.image_caption && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {hint.image_caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              📋 Conditions (first30)
            </h2>
            <ul className="space-y-2">
              {conditions.slice(0, 10).map((condition) => (
                <li key={condition.id} className="text-zinc-700 dark:text-zinc-300">
                  • {condition.name}
                  {condition.category && (
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                      ({condition.category})
                    </span>
                  )}
                </li>
              ))}
              {conditions.length > 10 && (
                <li className="text-zinc-500 dark:text-zinc-400 italic">
                  ... and {conditions.length - 10} more
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
              ❌ Error Connecting to Supabase
            </h2>
            <p className="text-red-700 dark:text-red-300">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            <div className="mt-4 text-sm text-red-600 dark:text-red-400">
              <p>Please check:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>NEXT_PUBLIC_SUPABASE_URL is set correctly</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY is set correctly</li>
                <li>Your Supabase tables are created</li>
                <li>Your database has data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
