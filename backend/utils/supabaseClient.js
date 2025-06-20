import 'dotenv/config'; // ES Module way to load environment variables
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
