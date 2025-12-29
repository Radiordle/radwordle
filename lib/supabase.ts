import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. Please create a .env.local file with your Supabase credentials. See README.md for instructions.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Please create a .env.local file with your Supabase credentials. See README.md for instructions.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Puzzle {
  id: string;
  puzzle_number: number;
  image_url: string;
  answer: string;
  difficulty: string;
  is_active: boolean;
  created_at?: string;
}

export interface Hint {
  id: string;
  puzzle_id: string;
  hint_order: number;
  content_type: string;
  hint_text: string | null;
  image_url: string | null;
  image_caption: string | null;
  created_at?: string;
}

export interface Condition {
  id: string;
  name: string;
  category: string;
  aliases: string[] | null;
  created_at?: string;
}

export async function getTotalPuzzleCount(): Promise<number> {
  const { count, error } = await supabase
    .from('puzzles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error getting puzzle count:', error);
    throw error;
  }

  return count || 0;
}

export async function getPuzzleByNumber(puzzleNumber: number): Promise<Puzzle> {
  const { data, error } = await supabase
    .from('puzzles')
    .select('*')
    .eq('puzzle_number', puzzleNumber)
    .single();

  if (error) {
    console.error('Error getting puzzle:', error);
    throw error;
  }

  return data;
}

export async function getHintsForPuzzle(puzzleId: string): Promise<Hint[]> {
  const { data, error } = await supabase
    .from('hints')
    .select('*')
    .eq('puzzle_id', puzzleId)
    .order('hint_order', { ascending: true });

  if (error) {
    console.error('Error getting hints:', error);
    throw error;
  }

  return data || [];
}

export async function getAllConditions(): Promise<Condition[]> {
  const { data, error } = await supabase
    .from('conditions')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error getting conditions:', error);
    throw error;
  }

  return data || [];
}
