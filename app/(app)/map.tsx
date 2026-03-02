import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function map() {
    const [region, setRegion] = useState(null);
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const loc = await Location.getCurrentPositionAsync({});

            setRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
        })();
    }, []);

    useEffect(() => {
        if (!region) return;

        const fetchRestaurants = async () => {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=1500&type=restaurant&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API}`;

            const res = await fetch(url);
            const json = await res.json();
            setRestaurants(json.results);

        };

        fetchRestaurants();
    }, [region]);

    const handleRestaurantPress = (placeId: string) => {
        console.log("Restaurant id pressed: ", placeId);
    };



    return (
        <View style={{ flex: 1 }}>
            {region && (
                <MapView
                    style={{ flex: 1, backgroundColor: "red" }}
                    initialRegion={region}
                    onRegionChangeComplete={(r) => setRegion(r)}
                    onPoiClick={(e) => {
                        const { placeId, name, coordinate } = e.nativeEvent;
                        console.log("Built‑in POI clicked:", placeId, name, coordinate);

                        // You can reuse your handler:
                        handleRestaurantPress(placeId);
                    }}

                >
                    {restaurants.map((r) => (
                        <Marker
                            key={r.place_id}
                            coordinate={{
                                latitude: r.geometry.location.lat,
                                longitude: r.geometry.location.lng,
                            }}
                            title={r.name}
                            description={r.vicinity}
                            onPress={() => handleRestaurantPress(r.place_id)}
                        />
                    ))}
                </MapView>
            )}
        </View>
    );

}