import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categoriesSlice";
import { RootState } from "../redux/store";

const AddCategoryScreen = ({ navigation }: { navigation: any }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState("");
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const user = useSelector((state: RootState) => state.user);
  const db = getFirestore();
  // console.log(categories);
  
  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      setInputError("Category name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const categoryRef = await addDoc(
        collection(db, "users", user.uid, "categories"),
        {
          name: newCategoryName,
        },
      );

      const newCategory = {
        id: categoryRef.id,
        name: newCategoryName,
      };

      // Dispatch an action to update the categories in the store
      dispatch(setCategories([...categories, newCategory]));

      setNewCategoryName("");
      setInputError("");
      Alert.alert("Success", "New category added.", [
        { text: "Add More" },
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="New Category Name"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
      />
      {inputError !== "" && <Text style={styles.errorText}>{inputError}</Text>}
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Add Category" onPress={addCategory} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    width: "100%",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
});

export default AddCategoryScreen;
