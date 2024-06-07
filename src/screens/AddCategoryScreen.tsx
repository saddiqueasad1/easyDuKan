import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Modal from "react-native-modal";

import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categoriesSlice";
import { RootState } from "../redux/store";
import ScreenWrapper from "../components/ScreenWrapper";
import { height, width } from "../utills/Dimension";
import { Color } from "../utills/GlobalStyles";
import Button from "../components/button";

const AddCategoryScreen = ({ navigation }: { navigation: any }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
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
        }
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

  const closeModel = () => setAddModal(false);
  return (
    <ScreenWrapper scrollEnabled={false}>
      <View style={styles.container}>
        <FlatList
          data={categories}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                width: width(92),
                backgroundColor: Color.backgroundColor,
                padding: height(2),
                margin: height(0.5),
                borderRadius: height(1),
              }}
            >
              <Text style={{ fontSize: height(2),fontWeight:'heavy', }}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index}
        />
        <TouchableOpacity
          onPress={() => setAddModal(true)}
          style={{
            position: "absolute",
            bottom: height(6),
            right: height(4),
            backgroundColor: "white",
          }}
        >
          <AntDesign
            name={"pluscircle"}
            color={Color.primaryColor}
            size={height(5)}
          />
        </TouchableOpacity>
        <Modal
          backdropOpacity={0.3}
          isVisible={addModal}
          onBackdropPress={closeModel}
          onBackButtonPress={closeModel}
        >
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Category Name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <Button
              isLoading={loading}
              title="Add Category"
              onPress={addCategory}
              containerStyle={{ width: width(80), marginTop: height(1) }}
            />
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: height(1.5),
    flex: 1,
  },
  input: {
    width: width(80),
    backgroundColor:Color.backgroundColor,
    margin:height(1),
    padding:height(1.5),
    borderRadius:height(3)
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: height(3),
    padding: height(2),
  },
});

export default AddCategoryScreen;
