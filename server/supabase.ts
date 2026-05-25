import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-role-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
