import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehvjaogbahyivotlsjyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodmphb2diYWh5aXZvdGxzanlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNzg1NzcsImV4cCI6MjA5NTk1NDU3N30.8wxZDkdVWzMrnl3D8_iToF6bLpB_r76CRh0pagsEX0Y';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    debug: true
  }
});

// Log authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session state:', session ? 'Authenticated' : 'Not authenticated');
});

