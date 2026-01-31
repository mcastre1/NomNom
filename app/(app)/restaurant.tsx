import FloatingButton from '@/components/FloatingButton';
import { supabase } from '@/lib/supabase';
import { registerCallback } from '@/utils/modalCallback';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PlaceholderImage = require('@/assets/images/adaptive-icon.png');

export default function RestaurantScreen() {
  const { name, address, photoUrl, genre } = useLocalSearchParams();
  const navigation = useNavigation();
  const [result, setResult] = useState({});

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [name]);

  useEffect(() => {
    addDish();
  }, [result]);

  async function uriToArrayBuffer(uri: string) {
    const response = await fetch(uri);
    return await response.arrayBuffer();
  }


  async function uploadImageToSupabaseBucket() {
    if (!result.photo) return;

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

    return data.path;
  }

  async function addDish() {
    const imagePath = uploadImageToSupabaseBucket();

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.from('dishes').insert([{
      name: result.name,
      rating: result.rating,
      notes: result.notes,
      photo: imagePath,
      user_id: user.id,
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

    console.log("button pressed");
  }

  return (
    <>
      <View style={styles.container}>
        {photoUrl ? <Image style={styles.imageStyle} source={{ uri: photoUrl }} /> : <Image style={styles.imageStyle} source={PlaceholderImage} />}
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
})
