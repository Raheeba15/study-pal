import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          return;
        }

        console.log('Initial auth state:', session ? 'Authenticated' : 'Not authenticated');
        setSession(session);

        if (session?.user) {
          console.log('Current user:', session.user);
          // First check if profile exists
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
            console.error('Error fetching profile:', fetchError);
            return;
          }

          // Create or update profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              username: session.user.email.split('@')[0], // Default username from email
              updated_at: new Date().toISOString(),
              created_at: existingProfile ? existingProfile.created_at : new Date().toISOString(),
            });

          if (profileError) {
            console.error('Error ensuring profile:', profileError);
          } else {
            console.log('Profile created/updated successfully');
          }
        }
      } catch (error) {
        console.error('Unexpected error during auth initialization:', error);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        console.log('New session state:', session ? 'Authenticated' : 'Not authenticated');
        
        setSession(session);

        if (session?.user) {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                email: session.user.email,
                updated_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error('Error updating profile on auth change:', profileError);
            } else {
              console.log('Profile updated on auth change');
            }
          } catch (error) {
            console.error('Unexpected error updating profile:', error);
          }
        }
      }
    );

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ✅ This checks if user row exists, and inserts if missing
async function ensureUserPreferenceRow(userId) {
  const { data, error } = await supabase
    .from("preferences") // or "profiles" if you're using that table name
    .select("id")
    .eq("id", userId)
    .single();

  if (!data && !error) {
    // Insert user with default theme "light"
    await supabase
      .from("preferences") // or "profiles"
      .insert([{ id: userId, theme: "light" }]);
  }
}
