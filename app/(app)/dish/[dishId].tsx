import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const PlaceholderImage = require('@/assets/images/adaptive-icon.png');

export default function DishScreen() {
    const { dishName, rating, dishId, notes } = useLocalSearchParams();
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

    const handleUpdate = () => {
        Alert.alert("Save Changes",
            "Do you want to update this dish with the new information?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Update",
                    onPress: async () => {
                        console.log("Updating dish...");
                        const { data, error } = await supabase
                            .from("dishes")
                            .update({
                                rating: starRating,
                                notes: note,
                            })
                            .eq("id", dishId)
                            .select()
                            .single();

                        if (error) {
                            console.error("Update error:", error);
                            return;
                        }

                        console.log("Updated:", data);
                        navigation.goBack();

                    }
                }
            ]
        );

    }

    const handleDelete = () => {
        Alert.alert(
            "Delete Dish",
            "Are you sure you want to delete this dish? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        console.log("Deleting dish...");
                        const { error } = await supabase
                            .from("dishes")
                            .delete()
                            .eq("id", dishId);

                        if (error) {
                            console.error("Delete error:", error);
                            return;
                        }

                        console.log("Deleted dish:", dishId);
                        navigation.goBack();

                    }
                }
            ]
        );

    }

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
                <View style={styles.bottomButtons}>
                    <Pressable style={[styles.button, styles.updateButton]} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Update</Text>
                    </Pressable>

                    <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </Pressable>
                </View>
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
    bottomButtons: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },

    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    updateButton: {
        backgroundColor: "#4A90E2",
    },

    deleteButton: {
        backgroundColor: "#E24A4A",
    },

    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
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
        marginBottom: 100,
    }
});