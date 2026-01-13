import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

// Creates the layout for the tabs in the authentication section.
export default function AuthLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#ffffff',
            headerStyle: {
                backgroundColor: '#25292e',
            },
            headerShadowVisible: false,
            headerTintColor: '#ffffff',
            tabBarStyle: {
                backgroundColor: '#25292e',
            },
        }}>
            <Tabs.Screen name="login"
            options={{
                title: 'Login',
                tabBarIcon: ({color, focused}) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} color = {color} size = {24}></Ionicons>
                )
            }}/>
            <Tabs.Screen name="register"
            options={{
                title: 'Register',
                tabBarIcon: ({color, focused}) => (
                    <Ionicons name={focused ? 'person-add' : 'person-add-outline'} color = {color} size = {24}></Ionicons>
                )
            }}/>
        </Tabs>
    )
}