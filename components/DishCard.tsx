
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    name: string;
    rating: string;
    photoUrl?: string;
    notes: string;
};


const PlaceholderImage = require('@/assets/images/adaptive-icon.png');


export default function DishCard({name, rating, photoUrl, notes}: Props){
    return (  
        <View style={styles.cardContainer}>
                {photoUrl ? <Image style={styles.imageStyle} source={{uri: photoUrl}}/> :<Image style={styles.imageStyle} source={PlaceholderImage}/>}
            <View style={styles.infoContainer}>
                <Text><Text style={{fontWeight:'bold'}}>Name:</Text> {name}</Text>
                <Text><Text style={{fontWeight:'bold'}}>Rating:</Text> {rating}</Text>
                <Text><Text style={{fontWeight:'bold'}}>Comments:</Text> {notes}</Text>
            </View>
        </View>
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