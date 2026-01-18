import { supabase } from "@/lib/supabase";
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Account() {

    async function logOut() {
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
    }

    return (
        <View style={styles.container}>
            <View style={styles.verticallySpaced}>
                <TouchableOpacity style={styles.button} onPress={logOut}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
        width: '100%',
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    button: {
        backgroundColor: "#801c1c",
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
})
