import { resolveCallback } from "@/utils/modalCallback";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SelectDishModal() {
  const { callbackId} = useLocalSearchParams();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(1);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState({});

  const PlaceholderImage = require('@/assets/images/adaptive-icon.png');

  function submit() {
    resolveCallback(callbackId, {
      name: name,
      rating: rating,
      notes:  note,
      photo: photo,
    });

    router.dismiss();
  }

  async function pickImage(){
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return null;
    setPhoto(result.assets[0]);
    
  }

  return <View style={styles.container}>
    {photo ? <Image style={styles.imageStyle} source={{uri: photo.uri}}/> :<Image style={styles.imageStyle}  source={PlaceholderImage}/>}
    <Button title="Pick Image" onPress={pickImage}/>
    <Text style={styles.label}>Name:</Text>
    <TextInput style={styles.input} onChangeText={setName}/>
    <Text style={styles.label}>Rating:</Text>
    <Picker style={styles.picker} selectedValue={rating} onValueChange={(value) => setRating(value)}>
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
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
        width: "100%"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        width: "100%",
    },
    picker: {
      width: "100%",
    },
    button: {
        backgroundColor: "#4A90E2",
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
        width: "100%",
    },
    imageStyle:{
        width:200,
        height:200,
        borderRadius:10,
    },

});
