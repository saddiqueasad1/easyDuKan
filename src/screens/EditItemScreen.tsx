import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchItem();
  }, [userId, itemId, db]);

  const saveItem = async () => {
    try {
      await setDoc(doc(db, "users", userId, "products", itemId), {
        name,
        description,
        unit_price: unitPrice,
        total_quantity: totalQuantity,
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Item</Text>
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
