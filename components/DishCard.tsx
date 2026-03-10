
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    name: string;
    rating: string;
    photoUrl?: string;
    notes: string;
    dishId: number;
};


const PlaceholderImage = require('@/assets/images/adaptive-icon.png');


export default function DishCard({ dishId, name, rating, photoUrl, notes }: Props) {
    const count = 5;
    const items = Array.from({ length: count });
    return (
        <Pressable onPress={
            ()=>{
                router.push({
                    pathname: '/(app)/dish/[dishId]',
                    params: {
                        dishName: name,
                        rating: rating,
                        dishId: dishId, 
                        notes: notes,
                    }
                })
            }
        }>
            <View style={styles.cardContainer}>
                {photoUrl ? <Image style={styles.imageStyle} source={{ uri: photoUrl }} /> : <Image style={styles.imageStyle} source={PlaceholderImage} />}
                <View style={styles.infoContainer}>
                    <Text><Text style={{ fontWeight: 'bold' }}>Name:</Text> {name}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Rating:</Text>
                    <Text>
                        {items.map((_, i) => (
                            i < Number(rating)
                                ? <Text key={i}>⭐</Text>   // filled star
                                : <Text key={i}>★</Text>   // empty star
                        ))}

                    </Text>

                    <Text><Text style={{ fontWeight: 'bold' }}>Comments:</Text> {notes}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',

        borderRadius: 16,
        margin: 10,
        elevation: 6,
        overflow: 'hidden',
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    infoStyle: {
        color: '#000000ff',
        fontSize: 28,
    },
    imageStyle: {
        width: 80,
        height: 80,
        borderRadius: 10,
        margin: 5,
    },
})