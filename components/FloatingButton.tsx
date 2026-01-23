import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FloatingButton({ onPress }) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        { bottom: insets.bottom + 10} // keeps it above the tab bar
      ]}
    >
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a5a12',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  plus: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
