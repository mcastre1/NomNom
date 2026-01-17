import { supabase } from "@/lib/supabase";
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Account() {

    async function logOut(){
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
    }

    return (<View>
        <Text>Hello</Text>
        <TouchableOpacity  onPress={logOut}>
            <Text >Log Out</Text>
        </TouchableOpacity>

    </View>)
}
