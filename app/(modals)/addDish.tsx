import { resolveCallback } from "@/utils/modalCallback";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SelectDishModal() {
  const { callbackId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");

  function submit() {
    resolveCallback(callbackId, {
      dish: name,
      rating: rating,
      notes:  note,
    });

    router.dismiss();
  }

  return <View style={styles.container}>
    <Text style={styles.label}>Name:</Text>
    <TextInput style={styles.input} onChangeText={setName}/>
    <Text style={styles.label}>Rating:</Text>
    <Picker selectedValue={rating} onValueChange={(value) => setRating(value)}>
      <Picker.Item label="1" value={1}/>
      <Picker.Item label="2" value={2}/>
      <Picker.Item label="3" value={3}/>
      <Picker.Item label="4" value={4}/>
      <Picker.Item label="5" value={5}/>
    </Picker>
    <Text style={styles.label}>Note:</Text>
    <TextInput style={styles.input} onChangeText={setNote}/>
    <Button title="Save" onPress={submit} />
  </View>
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 12,
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#4A90E2",
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },

});
