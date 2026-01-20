import RestaurantCard from '@/components/RestaurantCard';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API;


export default function AboutScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRestaurants() {
      // Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      // get current location
      let location = await Location.getLastKnownPositionAsync();

      if (!location){
        location = await Location.getCurrentPositionAsync({});
      }

      const { latitude, longitude } = location.coords;

      // url api call
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json` + `?location=${latitude},${longitude}` + `&radius=3000` + `&type=restaurant` + `&key=${GOOGLE_API_KEY}`;
      console.log(url);

      //fetch data
      const response = await fetch(url);
      const json = await response.json();
      console.log(json);

      const mapped = json.results.map((place) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        location: place.geometry.location,
        photoRef: place.photos?.[0]?.photo_reference,
        photoUrl: place.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null,
      }));

      setData(mapped);
      setLoading(false);
    }
    loadRestaurants();
  }, []);



  const [data, setData] = useState([]);

  return (
    loading ? (<View style={styles.loading}>
      <ActivityIndicator size="large" color="#000" />
    </View>) : (
      <View style={styles.container}>
        <FlatList style={styles.listStyle}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard name={item.name} address={item.address} photoUrl={item.photoUrl}/>
          )} />
      </View>
    )

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  listStyle: {
    width: '100%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});