# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RadWordle is a medical diagnosis guessing game where players identify radiological conditions from X-ray images. Similar to Wordle, players have 6 guesses with progressive hints revealed after each incorrect guess.

## Development Commands

```bash
cd radwordle              # Main application directory
pnpm install              # Install dependencies
pnpm dev                  # Start development server (http://localhost:3000)
pnpm build                # Production build
pnpm lint                 # Run ESLint
```

## Architecture

### Data Flow
- **Server Component** (`app/page.tsx`): Fetches puzzle data from Supabase at request time
- **Client Components** (`components/GamePage.tsx`, `GameClient.tsx`): Handle game state and user interactions
- **Local Storage** (`lib/localStorage.ts`): Persists game state and statistics client-side

### Key Modules

- `lib/supabase.ts` - Supabase client, database queries, TypeScript interfaces for `Puzzle`, `Hint`, `Condition`
- `lib/gameLogic.ts` - Puzzle number calculation based on epoch date, answer validation with exact/partial/incorrect matching
- `lib/localStorage.ts` - Game state persistence, player statistics tracking
- `components/GameClient.tsx` - Core game logic, guess handling, win/loss detection, results modal
- `components/DiagnosisAutocomplete.tsx` - Searchable dropdown for condition selection with keyboard navigation

### Game Logic

- Puzzles cycle based on days since `NEXT_PUBLIC_GAME_EPOCH` (default: 2025-01-01)
- Puzzle number = `(daysSinceEpoch % totalPuzzles) + 1`
- Answer matching normalizes text (lowercase, removes punctuation) and checks for shared significant words for partial matches

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
NEXT_PUBLIC_GAME_EPOCH=2025-01-01
```

## Database Schema (Supabase)

```
conditions
├── id (uuid, PK)
├── name (text, unique)
└── created_at (timestamptz)

puzzles
├── id (uuid, PK)
├── puzzle_number (int4)
├── image_url (text)
├── answer (text)
├── difficulty (text)
├── is_active (bool)
└── created_at (timestamptz)

hints
├── id (uuid, PK)
├── puzzle_id (uuid, FK → puzzles.id)
├── hint_order (int4)
├── content_type (text)
├── hint_text (text, nullable)
├── image_url (text, nullable)
├── image_caption (text, nullable)
└── created_at (timestamptz)

game_results
├── id (uuid, PK)
├── puzzle_number (int4)
├── won (bool)
├── guess_count (int4)
├── hints_used (int4)
├── time_to_complete_s (int4, nullable)
├── player_hash (text, nullable)
├── guesses (text[], nullable)
└── played_at (timestamptz)
```

**Relationships**:
- `hints.puzzle_id` → `puzzles.id`
- `puzzles.answer` → `conditions.name`
