import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function map() {
    const [region, setRegion] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [showSearchButton, setShowSearchButton] = useState(false);
    const [loading, setLoading] = useState(true);

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

    const handleMapReady = () => {
        setLoading(false);
        setShowSearchButton(true);
    }

    useEffect(() => {
        if (region) setShowSearchButton(true);
    }, [region]);


    const fetchRestaurants = async () => {
        if (!region) return;

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=1500&type=restaurant&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API}`;

        const res = await fetch(url);
        const json = await res.json();
        setRestaurants(json.results);

    };


    const handleRestaurantPress = (placeId: string) => {
        console.log("Restaurant id pressed: ", placeId);
    };


    const handleSearchInRegion = async () => {
        if (!region) return;

        const { latitude, longitude } = region;

        await fetchRestaurants();

        setShowSearchButton(false); // hide button after search
    };



    return (
        <View style={{ flex: 1 }}>
            {loading && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    zIndex: 999,
                }}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={{ marginTop: 10 }}>Loading map...</Text>
                </View>
            )}

            {showSearchButton && !loading && (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 20,
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 8,
                        elevation: 5,
                        zIndex: 999,
                    }}
                    onPress={handleSearchInRegion}
                >
                    <Text>Search This Area</Text>
                </TouchableOpacity>
            )}

            {region && (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                    onMapReady={handleMapReady}
                    onRegionChangeComplete={(r) => setRegion(r)}
                    onPoiClick={(e) => {
                        const { placeId } = e.nativeEvent;
                        console.log("Restaurant id pressed: ", placeId);
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