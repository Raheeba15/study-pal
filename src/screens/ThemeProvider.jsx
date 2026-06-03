import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthProvider";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [theme, setTheme] = useState("light");

  // 🟡 Sync preference from Supabase or localStorage
  useEffect(() => {
    const fetchTheme = async () => {
      if (!userId) return;

const { data } = await supabase
  .from("preferences") // ✅ now matches insert
  .select("theme")
  .eq("id", userId)
  .single();


      if (data?.theme) {
        setTheme(data.theme);
        localStorage.setItem("theme", data.theme); // keep them in sync
      } else {
        // fallback to localStorage
        const localTheme = localStorage.getItem("theme");
        if (localTheme) {
          setTheme(localTheme);
        }
      }
    };

    fetchTheme();
  }, [userId]);

  // 🟢 Save to localStorage on any theme change
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔁 Real-time listener for external Supabase updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("theme-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "preferences",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const newTheme = payload.new.theme;
          setTheme(newTheme);
          localStorage.setItem("theme", newTheme);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  // 🌓 Toggle and sync
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (userId) {
      await supabase
  .from("preferences")
  .update({ theme: newTheme })
  .eq("id", userId);

    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
