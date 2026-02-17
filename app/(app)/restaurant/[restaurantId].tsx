import DishCard from '@/components/DishCard';
import FloatingButton from '@/components/FloatingButton';
import { supabase } from '@/lib/supabase';
import { registerCallback } from '@/utils/modalCallback';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';

const EXPO_PUBLIC_BUCKET_URL = process.env.EXPO_PUBLIC_BUCKET_URL;
const PlaceholderImage = require('@/assets/images/adaptive-icon.png');


// Component/Page to show restaurant information and flatlist of dishes.
export default function RestaurantScreen() {
  const { restaurantId, name, address, photoUrl, genre } = useLocalSearchParams();
  const navigation = useNavigation();
  const [result, setResult] = useState({});
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  // On load change page's title to passed in restaurant name.
  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [name]);

  // Result gets set from addDish modal
  // on result change, call addDish function.
  useEffect(() => {
    if (Object.keys(result).length !== 0) {
      addDish();
    }
  }, [result]);

  // On Restaurant page load, retrieve dishes by user id and restaurant id.
  useEffect(() => {
    setLoading(true);
    getDishes();
  }, [restaurantId])

  // Change a uri to array, to upload image from addDish result
  // to supabase.
  async function uriToArrayBuffer(uri: string) {
    const response = await fetch(uri);
    return await response.arrayBuffer();
  }

  // Upload image to supabase bucket.
  async function uploadImageToSupabaseBucket() {
    if (Object.keys(result.photo).length === 0) return;

    // Get file/photo 's info
    const arrayBuffer = await uriToArrayBuffer(result.photo.uri)
    const fileExt = result.photo.uri.split('.').pop() ?? 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload to supabase bucket 'dishes'
    const { data, error } = await supabase.storage
      .from('dishes') // your bucket name
      .upload(fileName, arrayBuffer, {
        contentType: result.photo.mimeType ?? 'image/jpeg',
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // On succesful upload return the path to supabase bucket.
    return EXPO_PUBLIC_BUCKET_URL + data.path;
  }

  // Retrieve all dishes where user id is the same as logged in user.
  // and restaurant id is the same as the restaurant the user is currently looking at.
  async function getDishes() {
    // Retrieve current users info.
    const { data: { user } } = await supabase.auth.getUser();

    // Select query for dishes.
    const { data } = await supabase
      .from('dishes')
      .select('*')
      .eq('user_id', user.id)
      .eq('restaurant_id', restaurantId);

    // Keep/update data used for flatlist in page.
    setDishes(data);
    setLoading(false);
  }

  // Function used to put new dish into supabase table dishes.
  async function addDish() {
    // Upload image to supabase and retrieve correct path.
    const imagePath = await uploadImageToSupabaseBucket();

    // Get current user's information.
    const { data: { user } } = await supabase.auth.getUser();

    // Insert query to upload new dish into supabase table dishes.
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

  // Function used to redirect into modal window, addDish.
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={[styles.container, { flex: 0.35 }]}>
          {photoUrl ? <Image style={styles.imageStyle} source={{ uri: photoUrl }} /> : <Image style={styles.imageStyle} source={PlaceholderImage} />}
          <Text>{name}</Text>
          <Text>{address}</Text>
          <Text>{genre}</Text>
        </View>
        {loading ? (<View style={styles.loading}>
          <ActivityIndicator size="large" color="#000" />
        </View>) : (<View style={[styles.container, { flex: 0.65 }]}>
          <FlatList style={styles.listStyle}
            data={dishes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DishCard name={item.name} rating={item.rating} photoUrl={item.photo} notes={item.notes} />
            )} />
        </View>)}

      </View>
      <Button title="get dishes" onPress={getDishes} />

      <FloatingButton onPress={buttonPressed}></FloatingButton>
    </View>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
