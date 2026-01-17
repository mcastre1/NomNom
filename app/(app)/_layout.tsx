import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

// Creates the layout for the tabs in the authentication section.
export default function appTabs() {
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
            <Tabs.Screen name="account"
            options={{
                title: 'Account',
                tabBarIcon: ({color, focused}) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} color = {color} size = {24}></Ionicons>
                )
            }}/>
        </Tabs>
    )
}