import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categoriesSlice";
import { RootState } from "../redux/store";

const EditProductScreen = ({
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
          collection(db, "users", userId, "categories"),
        );
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setCategories(categoriesList as any));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
    fetchCategories();
  }, [userId, itemId, db, dispatch]);

  const validateInputs = () => {
    let valid = true;
    let errors = {
      name: "",
      description: "",
      unitPrice: "",
      totalQuantity: "",
    };

    if (!name.trim()) {
      errors.name = "Name is required.";
      valid = false;
    }
    if (!description.trim()) {
      errors.description = "Description is required.";
      valid = false;
    }
    if (!unitPrice.trim() || isNaN(Number(unitPrice))) {
      errors.unitPrice = "Valid unit price is required.";
      valid = false;
    }
    if (!totalQuantity.trim() || isNaN(Number(totalQuantity))) {
      errors.totalQuantity = "Valid total quantity is required.";
      valid = false;
    }

    setInputErrors(errors);
    return valid;
  };

  const saveItem = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "users", userId, "products", itemId), {
        name,
        description,
        unit_price: unitPrice,
        total_quantity: totalQuantity,
        category_id: selectedCategoryId,
      });
      Alert.alert("Success", "Item saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save item.");
    } finally {
      setLoading(false);
    }
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
    <ScrollView contentContainerStyle={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Text style={styles.text}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(value) => handleInputChange("name", value)}
      />
      {inputErrors.name !== "" && (
        <Text style={styles.errorText}>{inputErrors.name}</Text>
      )}
      <Text style={styles.text}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(value) => handleInputChange("description", value)}
      />
      {inputErrors.description !== "" && (
        <Text style={styles.errorText}>{inputErrors.description}</Text>
      )}
      <Text style={styles.text}>Unit Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Unit Price"
        keyboardType="numeric"
        value={unitPrice}
        onChangeText={(value) => handleInputChange("unitPrice", value)}
      />
      {inputErrors.unitPrice !== "" && (
        <Text style={styles.errorText}>{inputErrors.unitPrice}</Text>
      )}
      <Text style={styles.text}>Total Quantity</Text>

      <TextInput
        style={styles.input}
        placeholder="Total Quantity"
        keyboardType="numeric"
        value={totalQuantity}
        onChangeText={(value) => handleInputChange("totalQuantity", value)}
      />
      {inputErrors.totalQuantity !== "" && (
        <Text style={styles.errorText}>{inputErrors.totalQuantity}</Text>
      )}
      <Text style={styles.text}>Category</Text>
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
        <Button
          title="Add New Category"
          onPress={() => navigation.navigate("AddCategoryScreen")}
        />
        <Button title="Save Item" onPress={saveItem} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1,
  },
  text: {
    textAlign: "left",
    width: "100%",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
});

export default EditProductScreen;
