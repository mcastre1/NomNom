import { resolveCallback } from "@/utils/modalCallback";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Button, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SelectDishModal() {
  const { callbackId } = useLocalSearchParams();
  const [name, setName] = useState("");

  const [starRating, setStarRating] = useState(1) // final chosen star rating

  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);

  const PlaceholderImage = require('@/assets/images/adaptive-icon.png');

  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.dismiss();
      return true;
    });

    return () => sub.remove();
  }, []);


  function submit() {
    resolveCallback(callbackId, {
      name: name,
      rating: starRating,
      notes: note,
      photo: photo,
    });

    router.dismiss();
  }

  async function photoPicker() {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        let result;

        if (buttonIndex === 0) {
          result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1
          });
        }

        if (buttonIndex === 1) {
          result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
          });
        }


        if (!result || result.canceled) return;

        setPhoto(result.assets[0]);
        
      }
    );
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return null;
    setPhoto(result.assets[0]);

  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {photo ? <Image style={styles.imageStyle} source={{ uri: photo.uri }} /> : <Image style={styles.imageStyle} source={PlaceholderImage} />}
        <Button title="Upload Image" onPress={photoPicker} />
        <Text style={styles.label}>Name:</Text>
        <TextInput style={styles.input} onChangeText={setName} />
        <Text style={styles.label}>Rating:</Text>

        {/*Creating the star rating element.*/}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1; // Value given to current star
            const isSelected = starValue <= starRating;

            return (
              <Pressable key={i}
                onPress={() =>
                  setStarRating(starValue)}>
                <Text
                  style={[
                    styles.star,
                    isSelected && styles.selectedStar,
                  ]}
                >
                  ★
                </Text>
              </Pressable>
            )
          })}
        </View>

        <Text style={styles.label}>Note:</Text>
        <TextInput style={[styles.input, styles.multiline]} onChangeText={setNote} multiline numberOfLines={4} />
        <Button title="Save" onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>);
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
    textAlignVertical: "top",
    color:"black",
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
  imageStyle: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  star: {
    fontSize: 32,
    color: "#ccc",
  },
  previewStar: {
    color: "#f5d48b", // soft preview color
  },
  selectedStar: {
    color: "#f1b000", // bright selected color
  },
  multiline: {
    minHeight: 100,
  }


});
