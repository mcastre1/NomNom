import RestaurantCard from '@/components/RestaurantCard';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const GOOGLE_API_KEY = 'AIzaSyAtrvII5_W6ms7VM7j_mbatXjxySgSO9yo';

export default function AboutScreen() {
  useEffect(() => {
    async function loadRestaurants() {
      // Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted'){
        console.log('Permission denied');
        return;
      }

      // get current location
      const location = await Location.getCurrentPositionAsync({});
      const {latitude, longitude} = location.coords;

      // url api call
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json` + `?location=${latitude},${longitude}` + `&radius=3000` + `&type=restaurant` + `&key=${GOOGLE_API_KEY}`;
      console.log(url);

      //fetch data
      const response = await fetch(url);
      const json = await response.json();

      const mapped = json.results.map((place) => ({ 
        id: place.place_id, 
        name: place.name, 
        address: place.vicinity, 
        location: place.geometry.location, 
        photoRef: place.photos?.[0]?.photo_reference, 
      }));

      setData(mapped);
    }
    loadRestaurants();
  }, []);



  const [data, setData] = useState([]);

  return (
    <View style={styles.container}>
      <FlatList style={styles.listStyle}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard name={item.name} address={item.address} />
        )} />
    </View>
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
});