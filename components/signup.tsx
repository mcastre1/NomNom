import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from '../lib/supabase';

export default function SignUp() {
    const [email, setEmail] = useState('Email')
    const [password, setPassword] = useState('Password')
    const [loading, setLoading] = useState(false)

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
            <Text style={styles.label}>Password:</Text>
            <TextInput style={styles.input} secureTextEntry placeholder="*********" onChangeText={setPassword} />
            <TouchableOpacity style={styles.button} onPress={signUpWithEmail}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 12,
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#4A90E2",
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

});