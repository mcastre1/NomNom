import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Key and url retrieved from supabase website.
const supabaseUrl = process.env.EXPO_PUBLIC_BASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_PUBLISH_KEY;

export const supabase = createClient(supabaseUrl, supabasePublishableKey,{
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});