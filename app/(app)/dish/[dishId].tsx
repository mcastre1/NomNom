import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const PlaceholderImage = require('@/assets/images/adaptive-icon.png');

export default function DishScreen() {
    const { dishName, rating, photoUrl, notes } = useLocalSearchParams();
    const navigation = useNavigation();

    const [name, setName] = useState(dishName);
    const [starRating, setStarRating] = useState(Number(rating));
    const [note, setNote] = useState(notes);

    useEffect(() => {
        navigation.setOptions({
            title: dishName,
        });
    }, [dishName]);

    useEffect(() => {
        setName(dishName);
        setStarRating(Number(rating));
        setNote(notes);
    }, [dishName, rating, notes]);


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
        >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
                {/***photo ? <Image style={styles.imageStyle} source={{ uri: photo.uri }} /> : <Image style={styles.imageStyle} source={PlaceholderImage} />**/}
                <Text style={styles.label}>Name:</Text>
                <TextInput style={styles.input} onChangeText={setName} value={name} />
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
                <TextInput style={[styles.input, styles.multiline]} onChangeText={setNote} multiline numberOfLines={4} value={note} />
                <Button title="Save" onPress={() => { console.log("Button") }} />
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
        color: "black",
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