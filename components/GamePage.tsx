'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Puzzle, Hint, Condition } from '@/lib/supabase';
import GameClient from './GameClient';
import { GameState } from '@/lib/localStorage';

interface GamePageProps {
  puzzle: Puzzle;
  hints: Hint[];
  conditions: Condition[];
}

export default function GamePage({ puzzle, hints, conditions }: GamePageProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleGameStateChange = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  // Determine which hints to show based on game state
  const visibleHints = gameState ? hints.slice(0, gameState.revealedHints) : [];

  return (
    <div className="min-h-screen relative overflow-y-auto overflow-x-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744] via-[#2d3e5f] to-[#1a2744]">
        {/* Background decorative medical images */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-[url('/placeholder-xray.png')] bg-contain bg-no-repeat opacity-30"></div>
          <div className="absolute right-0 top-1/3 w-64 h-64 bg-[url('/placeholder-scan.png')] bg-contain bg-no-repeat opacity-30"></div>
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-[url('/placeholder-ct.png')] bg-contain bg-no-repeat opacity-30 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with buttons */}
        <div className="flex justify-between items-start p-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3d4d68] hover:bg-[#4a5b7a] text-white rounded-lg transition-colors">
            <span className="text-xl">📁</span>
            <span className="font-medium">Archives</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3d4d68] hover:bg-[#4a5b7a] text-white rounded-lg transition-colors">
            <span className="text-xl">📊</span>
            <span className="font-medium">Stats</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-16 h-16">
              <Image
                src="/radle_icon.svg"
                alt="Radiordle Icon"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h1 className="text-6xl text-white font-fredoka font-bold tracking-tight">
              Radiordle
            </h1>
          </div>

          {/* Medical Image Display */}
          <div className="w-full max-w-3xl mb-8">
            <div className="relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl">
              {puzzle.image_url ? (
                <Image
                  src={puzzle.image_url}
                  alt={`Puzzle ${puzzle.puzzle_number}`}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <p>No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <h2 className="text-4xl text-white font-bold mb-6">
            What&apos;s the Diagnosis?
          </h2>

          {/* Hints Display - only show revealed hints */}
          {visibleHints.length > 0 && (
            <div className="w-full max-w-2xl space-y-3 mb-6">
              {visibleHints.map((hint, index) => {
                // Hints are revealed after a guess. The guess that revealed this hint is at index.
                // To color the hint based on the NEXT guess after it was revealed, we look at index + 1.
                // If there's no next guess yet, the hint stays blue.
                const nextGuessResult = gameState?.guessResults[index + 1];

                // Determine the color and text color based on the next guess result
                let hintStyle = '';
                let textColor = 'text-white';

                if (nextGuessResult === 'correct') {
                  // Green for correct guess
                  hintStyle = 'bg-[#407763]';
                  textColor = 'text-white';
                } else if (nextGuessResult === 'partial') {
                  // Yellow for partial match
                  hintStyle = 'bg-[#f6d656]';
                  textColor = 'text-black';
                } else if (nextGuessResult === 'incorrect') {
                  // Red for incorrect guess
                  hintStyle = 'bg-[#9e4a4a]';
                  textColor = 'text-white';
                } else {
                  // Default blue if no next guess yet
                  hintStyle = 'bg-[#6b89b8] bg-opacity-60';
                  textColor = 'text-white';
                }

                return (
                  <div
                    key={hint.id}
                    className={`${hintStyle} ${textColor} backdrop-blur-sm rounded-lg px-6 py-4 transition-all duration-300`}
                  >
                    {hint.hint_text ? (
                      <p className="text-lg">{hint.hint_text}</p>
                    ) : hint.image_caption ? (
                      <p className="text-lg">{hint.image_caption}</p>
                    ) : (
                      <p className="text-lg opacity-50">Hint {index + 1}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Input and Submit */}
          <GameClient
            conditions={conditions}
            puzzleNumber={puzzle.puzzle_number}
            correctAnswer={puzzle.answer}
            onGameStateChange={handleGameStateChange}
          />
        </div>
      </div>
    </div>
  );
}
