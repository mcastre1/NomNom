import DishCard from '@/components/DishCard';
import FloatingButton from '@/components/FloatingButton';
import { supabase } from '@/lib/supabase';
import { registerCallback } from '@/utils/modalCallback';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

const EXPO_PUBLIC_BUCKET_URL = process.env.EXPO_PUBLIC_BUCKET_URL;
const PlaceholderImage = require('@/assets/images/adaptive-icon.png');

export default function RestaurantScreen() {
  const { restaurantId, name, address, photoUrl, genre } = useLocalSearchParams();
  const navigation = useNavigation();
  const [result, setResult] = useState({});
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [name]);

  useEffect(() => {
    if (Object.keys(result).length !== 0) {
      addDish();
    }
  }, [result]);

  async function uriToArrayBuffer(uri: string) {
    const response = await fetch(uri);
    return await response.arrayBuffer();
  }


  async function uploadImageToSupabaseBucket() {
    if (Object.keys(result.photo).length === 0) return;

    const arrayBuffer = await uriToArrayBuffer(result.photo.uri)
    const fileExt = result.photo.uri.split('.').pop() ?? 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;

    console.log(fileExt);
    console.log(fileName);

    const { data, error } = await supabase.storage
      .from('dishes') // your bucket name
      .upload(fileName, arrayBuffer, {
        contentType: result.photo.mimeType ?? 'image/jpeg',
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    return EXPO_PUBLIC_BUCKET_URL + data.path;
  }

  async function getDishes() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('dishes')
      .select('*')
      .eq('user_id', user.id)
      .eq('restaurant_id', restaurantId);

    setDishes(data);
  }

  async function addDish() {
    const imagePath = await uploadImageToSupabaseBucket();
    console.log(imagePath);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.from('dishes').insert([{
      name: result.name,
      rating: result.rating,
      notes: result.notes,
      photo: imagePath,
      user_id: user.id,
      restaurant_id: restaurantId,
    }], { returning: 'minimal' });

    if (error) {
      console.log(error.message)
    }
  }

  function buttonPressed() {
    const id = Date.now().toString();

    registerCallback(id, (result: any) => {
      setResult(result);
    });

    router.push({
      pathname: "/(modals)/addDish",
      params: { callbackId: id }
    });
  }

  return (
    <>
      <View style={styles.container}>
        {photoUrl ? <Image style={styles.imageStyle} source={{ uri: photoUrl }} /> : <Image style={styles.imageStyle} source={PlaceholderImage} />}
        <Text>{name}</Text>
        <Text>{address}</Text>
        <Text>{genre}</Text>
      </View>
      <View style={styles.container}>
        <FlatList style={styles.listStyle}
          data={dishes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DishCard name={item.name} rating={item.rating} photoUrl={item.photo} notes={item.notes}/>
          )} />
      </View>
      <Button title="get dishes" onPress={getDishes} />
      <FloatingButton onPress={buttonPressed}></FloatingButton>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  imageStyle: {
    width: 120,
    height: 120,
    borderRadius: 10,
    margin: 20,
  },
  listStyle: {
    width: '100%',
  },
})
