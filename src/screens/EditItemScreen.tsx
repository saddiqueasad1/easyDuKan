import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const EditItemScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { userId, itemId } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const db = getFirestore();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemRef = doc(db, "users", userId, "products", itemId);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          const data = itemSnap.data();
          setName(data.name);
          setDescription(data.description);
          setUnitPrice(data.unit_price);
          setTotalQuantity(data.total_quantity);
          setSelectedCategoryId(data.category_id || "");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(
          collection(db, "users", userId, "categories"),
        );
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList as never[]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItem();
    fetchCategories();
  }, [userId, itemId, db]);

  const saveItem = async () => {
    try {
      await setDoc(doc(db, "users", userId, "products", itemId), {
        name,
        description,
        unit_price: unitPrice,
        total_quantity: totalQuantity,
        category_id: selectedCategoryId,
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Category name cannot be empty.");
      return;
    }
    try {
      const categoryRef = await addDoc(
        collection(db, "users", userId, "categories"),
        {
          name: newCategoryName,
        },
      );
      const newCategory = {
        id: categoryRef.id,
        name: newCategoryName,
      };
      setCategories([...categories, newCategory] as never);
      setSelectedCategoryId(newCategory.id);
      setNewCategoryName("");
      Alert.alert("Success", "New category added.");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not add category. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Unit Price"
        value={unitPrice}
        onChangeText={setUnitPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Total Quantity"
        value={totalQuantity}
        onChangeText={setTotalQuantity}
      />
      <Picker
        selectedValue={selectedCategoryId}
        // style={styles.input}
        onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
      >
        {categories.map((category: { name: string; id: string }) => (
          <Picker.Item
            label={category.name}
            value={category.id}
            key={category.id}
          />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="New Category Name"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
      />
      <Button title="Add New Category" onPress={addCategory} />
      <Button title="Save Item" onPress={saveItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default EditItemScreen;
