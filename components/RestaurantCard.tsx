
import { Image } from 'expo-image';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type Props = {
    name: string;
    address: string;
    imgSource?: ImageSourcePropType;
};


const PlaceholderImage = require('@/assets/images/adaptive-icon.png');


export default function RestaurantCard({name, address, imgSource}: Props){
    return (
        <View style={styles.cardContainer}>
                <Image style={styles.imageStyle} source={PlaceholderImage}/>
            <View style={styles.infoContainer}>
                <Text>{name}</Text>
                <Text>{address}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        width: '100%',
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
    },
})