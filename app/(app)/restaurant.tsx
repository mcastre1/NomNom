import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function RestaurantScreen() {
  const {name, address, genre } = useLocalSearchParams();

  return (
    <View>
      <Text>{name}</Text>
      <Text>{address}</Text>
      <Text>{genre}</Text>
    </View>
  );
}
