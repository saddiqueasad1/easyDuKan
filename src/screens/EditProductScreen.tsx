import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Picker } from "@react-native-picker/picker";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  getFirestore,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categoriesSlice";
import { RootState } from "../redux/store";
import { addProduct, updateProduct } from "../redux/slices/productSlice";
import { IProduct } from "../utills/types";
import ScreenWrapper from "../components/ScreenWrapper";
import { height, width } from "../utills/Dimension";
import { Color } from "../utills/GlobalStyles";
import Button from "../components/button";
import { setAppLoader } from "../redux/slices/loaderSlice";
import { successMessage } from "../utills/GlobalMethods";

const EditProductScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;
  const { itemId } = route.params;
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const products = useSelector((state: RootState) => state.products);
  const selectedBranchId = user.selectedBranchId;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    name: "",
    description: "",
    unitPrice: "",
    totalQuantity: "",
    purchasePrice: "",
  });
  const db = getFirestore();

  useEffect(() => {
    navigation.setOptions({
      title: itemId ? "Edit Product" : "Add Product",
    });
    const fetchItem = async () => {
      if (itemId) {
        dispatch(setAppLoader(true));
        try {
          const selectProductById: IProduct | undefined = products.find(
            (product) => product.id === itemId
          );
          if (selectProductById) {
            setName(selectProductById.name || "");
            setDescription(selectProductById.description);
            setUnitPrice(selectProductById.unitPrice);
            setTotalQuantity(selectProductById.totalQuantity);
            setSelectedCategoryId(selectProductById.category_id || "");
          } else {
            // Handle case when no product is found with the given id
            console.log("Product not found");
          }
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(setAppLoader(false));
        }
      }
    };

    const fetchCategories = async () => {
      dispatch(setAppLoader(true));

      try {
        const categoriesSnapshot = await getDocs(
          collection(db, "branches", selectedBranchId, "categories"),
        );
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setCategories(categoriesList as any));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setAppLoader(false));
      }
    };

    fetchItem();
    fetchCategories();
  }, [userId, itemId, db, dispatch, navigation, products]);

  const validateInputs = () => {
    let valid = true;
    let errors = {
      name: "",
      description: "",
      unitPrice: "",
      totalQuantity: "",
      purchasePrice: "",
    };

    if (!name.trim()) {
      errors.name = "Name is required.";
      valid = false;
    }
    if (!description.trim()) {
      errors.description = "Description is required.";
      valid = false;
    }
    if (!unitPrice || isNaN(Number(unitPrice))) {
      errors.unitPrice = "Valid unit price is required.";
      valid = false;
    }
    if (!totalQuantity || isNaN(Number(totalQuantity))) {
      errors.totalQuantity = "Valid total quantity is required.";
      valid = false;
    }
    if (!purchasePrice || isNaN(Number(purchasePrice))) {
      errors.purchasePrice = "Valid total purchase Price is required.";
      valid = false;
    }

    setInputErrors(errors);
    return valid;
  };

  const saveItem = async () => {
    if (!validateInputs()) {
      return;
    }
    dispatch(setAppLoader(true));

    try {
      if (itemId) {
        await setDoc(
          doc(db, "branches", selectedBranchId, "products", itemId),
          {
            name,
            description,
            unitPrice: unitPrice,
            totalQuantity: totalQuantity,
            category_id: selectedCategoryId,
            purchasePrice: purchasePrice,
          }
        );
        Alert.alert("Success", "Prodduct updated successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
        dispatch(
          updateProduct({
            name,
            description,
            unitPrice: unitPrice,
            totalQuantity: totalQuantity,
            category_id: selectedCategoryId,
            id: itemId,
            purchasePrice: purchasePrice,
          }),
        );
      } else {
        const result = await addDoc(
          collection(db, "branches", selectedBranchId, "products"),
          {
            name,
            description,
            unitPrice: unitPrice,
            totalQuantity: totalQuantity,
            category_id: selectedCategoryId,
            purchasePrice: purchasePrice,
          }
        );
        dispatch(
          addProduct({
            name,
            description,
            unitPrice: unitPrice,
            totalQuantity: totalQuantity,
            category_id: selectedCategoryId,
            purchasePrice: purchasePrice,
            id: result.id,
          })
        );
        // Alert.alert("Success", "Product added successfully!", [
        //   { text: "Add More" },
        //   { text: "OK", onPress: () =>  },
        // ]);
        navigation.goBack();
        successMessage("New Product Added");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save Product.");
    } finally {
      dispatch(setAppLoader(false));
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
        setUnitPrice(Number(value));
        break;
      case "totalQuantity":
        setTotalQuantity(Number(value));
        break;
      case "purchasePrice":
        setPurchasePrice(Number(value));
        break;
      default:
        break;
    }
  };

  return (
    <ScreenWrapper scrollEnabled>
      <View style={styles.container}>
        {categories.length > 0 ? (
          <View
            style={{
              backgroundColor: Color.backgroundColor,
              padding: height(2),
              borderRadius: height(3),
              marginBottom: height(5),
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: height(2),
                  fontWeight: "600",
                }}
              >
                Select Category
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AddCategoryScreen", { add: true })
                }
              >
                <AntDesign
                  name={"pluscircle"}
                  color={Color.primaryColor}
                  size={height(2.5)}
                />
              </TouchableOpacity>
            </View>
            <Picker
              style={{
                padding: height(1),
                marginVertical: height(1),
                borderRadius: height(3),
                width: width(90),
                backgroundColor: "white",
              }}
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
            {/* <Button
            title="Add New Category"
            onPress={() => navigation.navigate("AddCategoryScreen")}
          /> */}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("AddCategoryScreen",{ add: true })}
            style={{
              backgroundColor: Color.backgroundColor,
              padding: height(2),
              borderRadius: height(3),
              marginBottom: height(5),
              width: width(95),
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: height(2),
                  fontWeight: "600",
                }}
              >
                Add Category
              </Text>

              <AntDesign
                name={"pluscircle"}
                color={Color.primaryColor}
                size={height(2.5)}
              />
            </View>
          </TouchableOpacity>
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
          value={unitPrice + ""}
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
          value={totalQuantity + ""}
          onChangeText={(value) => handleInputChange("totalQuantity", value)}
        />
        {inputErrors.totalQuantity !== "" && (
          <Text style={styles.errorText}>{inputErrors.totalQuantity}</Text>
        )}
        <Text style={styles.text}>Purchase Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Purchase Price"
          keyboardType="numeric"
          value={purchasePrice + ""}
          onChangeText={(value) => handleInputChange("purchasePrice", value)}
        />
        {inputErrors.purchasePrice !== "" && (
          <Text style={styles.errorText}>{inputErrors.purchasePrice}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Save Item"
            onPress={saveItem}
            containerStyle={{ width: width(90), marginTop: height(3) }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: height(2),
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
    fontSize: height(1.8),
    fontWeight: "500",
  },
  input: {
    padding: height(1),
    marginVertical: height(1),
    borderRadius: height(3),
    width: width(94),
    backgroundColor: Color.backgroundColor,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
});

export default EditProductScreen;
