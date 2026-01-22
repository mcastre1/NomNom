import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Key and url retrieved from supabase website.
const supabaseUrl = "https://aybqpizxpbbafoqnlgbm.supabase.co"
const supabasePublishableKey = "sb_publishable_uX2VSulYR_IoQUatz_3IZA_wS7sVOFl"

export const supabase = createClient(supabaseUrl, supabasePublishableKey,{
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});