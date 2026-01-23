import { resolveCallback } from "@/utils/modalCallback";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from 'react-native';

export default function SelectDishModal() {
  const { callbackId } = useLocalSearchParams();

  function submit() {
    resolveCallback(callbackId, {
      dish: "Burrito",
      rating: 5,
      notes: "Your wife loved it"
    });

    router.dismiss();
  }

  return <Button title="Save" onPress={submit} />;
}
