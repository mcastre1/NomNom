import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';

// Auto-refresh tokens when app is foregrounded
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        // 1. Load saved session from storage
        const stored = await AsyncStorage.getItem("supabase_session");

        if (stored) {
          const parsed = JSON.parse(stored);

          // Ensure required tokens exist
          if (parsed?.access_token && parsed?.refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token,
            });

            if (!error) {
              setSession(data.session);
            }
          }
        } else {
          // Fallback to Supabase internal session
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
        }
      } catch (err) {
        console.log("Error restoring session:", err);
      }

      setLoading(false);
    };

    loadSession();

    // 2. Save session on every change
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        try {
          if (newSession) {
            await AsyncStorage.setItem(
              "supabase_session",
              JSON.stringify(newSession)
            );
          } else {
            await AsyncStorage.removeItem("supabase_session");
          }
        } catch (err) {
          console.log("Error saving session:", err);
        }

        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <ActionSheetProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen name="(app)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </ActionSheetProvider>
  );
}
