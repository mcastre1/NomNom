import { resolveCallback } from "@/utils/modalCallback";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from 'react-native';

export default function SelectDishModal() {
  const { callbackId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");

  function submit() {
    resolveCallback(callbackId, {
      dish: name,
      rating: 5,
      notes:  note,
    });

    router.dismiss();
  }

  return <View>
    <Text>Name:</Text>
    <TextInput onChangeText={setName}/>
    <Text>Rating:</Text>
    <Text>Note:</Text>
    <TextInput onChangeText={setNote}/>
    <Button title="Save" onPress={submit} />
  </View>
}
