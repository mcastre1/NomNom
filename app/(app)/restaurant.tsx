import FloatingButton from '@/components/FloatingButton';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PlaceholderImage = require('@/assets/images/adaptive-icon.png');

export default function RestaurantScreen() {
  const {name, address, photoUrl, genre} = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(()=>{
    navigation.setOptions({
      title:name,
    });
  }, [name]);

  function buttonPressed(){
    console.log("Button pressed")
  }

  return (
    <>
    <View style={styles.container}>
      {photoUrl ? <Image style={styles.imageStyle} source={{uri: photoUrl}}/> :<Image style={styles.imageStyle} source={PlaceholderImage}/>}
      <Text>{name}</Text>
      <Text>{address}</Text>
      <Text>{genre}</Text>
    </View>
    <FloatingButton onPress={buttonPressed}></FloatingButton>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
    width:'100%',
  },
  imageStyle:{
        width:120,
        height:120,
        borderRadius:10,
        margin:20,
    },
})
