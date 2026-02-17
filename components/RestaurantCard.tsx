import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    restaurantId: string;
    name: string;
    address: string;
    photoUrl?: string;
    types: Array<string>;
};


const PlaceholderImage = require('@/assets/images/adaptive-icon.png');


export default function RestaurantCard({restaurantId, name, address, photoUrl, types}: Props){
    return (
        // Pressable will route us to restaurant and pass in some parameters about the clicked restaurant.
        // To show a detail screen about the restaurant.
        <Pressable onPress={
            ()=> router.push({
                pathname: '/(app)/restaurant',
                params: {
                    restaurantId: restaurantId,
                    name: name,
                    address: address,
                    photoUrl: photoUrl,
                    types: types,
                },
            })
        }>
        <View style={styles.cardContainer}>
                {photoUrl ? <Image style={styles.imageStyle} source={{uri: photoUrl}}/> :<Image style={styles.imageStyle} source={PlaceholderImage}/>}
            <View style={styles.infoContainer}>
                <Text>{name}</Text>
                <Text>{address}</Text>
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

        borderRadius:16,
        margin:10,
        elevation:6,
        overflow:'hidden',
    },
    infoContainer:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
    },
    infoStyle:{
        color:'#000000ff',
        fontSize:28,
    },
    imageStyle:{
        width:80,
        height:80,
        borderRadius:10,
        margin:5,
    },
})