import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
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
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categoriesSlice";
import { RootState } from "../redux/store";

const EditItemScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { userId, itemId } = route.params;
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    name: "",
    description: "",
    unitPrice: "",
    totalQuantity: "",
    newCategoryName: "",
  });
  const db = getFirestore();

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(
          collection(db, "users", userId, "categories")
        );
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setCategories(categoriesList));
        // setCategories(categoriesList);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
    fetchCategories();
  }, [userId, itemId, db]);

  const saveItem = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    navigation.navigate("AddCategoryScreen");
  };

  const handleInputChange = (key: string, value: string) => {
    setInputErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    switch (key) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "unitPrice":
        setUnitPrice(value);
        break;
      case "totalQuantity":
        setTotalQuantity(value);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(value) => handleInputChange("name", value)}
      />
      {inputErrors.name !== "" && (
        <Text style={styles.errorText}>{inputErrors.name}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(value) => handleInputChange("description", value)}
      />
      {inputErrors.description !== "" && (
        <Text style={styles.errorText}>{inputErrors.description}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Unit Price"
        value={unitPrice}
        onChangeText={(value) => handleInputChange("unitPrice", value)}
      />
      {inputErrors.unitPrice !== "" && (
        <Text style={styles.errorText}>{inputErrors.unitPrice}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Total Quantity"
        value={totalQuantity}
        onChangeText={(value) => handleInputChange("totalQuantity", value)}
      />
      {inputErrors.totalQuantity !== "" && (
        <Text style={styles.errorText}>{inputErrors.totalQuantity}</Text>
      )}
      <Picker
        style={styles.input}
        selectedValue={selectedCategoryId}
        onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
      >
        {categories.map((category: any) => (
          <Picker.Item
            label={category.name}
            value={category.id}
            key={category.id}
          />
        ))}
      </Picker>
      <View style={styles.buttonContainer}>
        <Button title="Add New Category" onPress={addCategory} />
        <Button title="Save Item" onPress={saveItem} />
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
});

export default EditItemScreen;
