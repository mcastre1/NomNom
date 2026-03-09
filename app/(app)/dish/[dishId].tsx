import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

const PlaceholderImage = require('@/assets/images/adaptive-icon.png');

export default function DishScreen(){
    const {dishName, rating, photoUrl, notes} = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title:dishName,
        });
    }, [dishName]);

    return (
        <View>
            <Text>{dishName}</Text>
        </View>
    )
}