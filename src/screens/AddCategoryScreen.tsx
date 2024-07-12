import React, { useEffect, useState } from "react";
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
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, setCategories } from "../redux/slices/categoriesSlice";
import { RootState } from "../redux/store";
import ScreenWrapper from "../components/ScreenWrapper";
import { height, width } from "../utills/Dimension";
import { Color } from "../utills/GlobalStyles";
import Button from "../components/button";
import { selectAppLoader, setAppLoader } from "../redux/slices/loaderSlice";
import { successMessage } from "../utills/GlobalMethods";

const AddCategoryScreen = ({ navigation, route }: { navigation: any }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [inputError, setInputError] = useState("");
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const user = useSelector((state: RootState) => state.user);
  const selectedBranchId = user.selectedBranchId;
  const db = getFirestore();
  useEffect(() => {
    fetchCategories();
    if (route?.params) {
      setAddModal(true);
    }
  }, []);

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
      dispatch(setAppLoader(false));
      console.log("cat sceen", error);
    } finally {
      dispatch(setAppLoader(false));
    }
  };
  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      setInputError("Category name cannot be empty.");
      return;
    } else {
      setAddModal(false);
    }

    dispatch(setAppLoader(true));
    try {
      const categoryRef = await addDoc(
        collection(db, "branches", selectedBranchId, "categories"),
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
      successMessage("Category Added SuccessFuly");
      // Alert.alert("Success", "New category added.", [
      //   { text: "Add More" },
      //   { text: "OK", onPress: () => navigation.goBack() },
      // ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not add category. Please try again.");
    } finally {
      dispatch(setAppLoader(false));
    }
  };
  const handleDelete = async (id: string) => {
    console.log("Delete category", id);
    dispatch(deleteCategory(id));
    const productRef = doc(db, "branches", selectedBranchId, "categories", id);
    try {
      await deleteDoc(productRef);
      console.log("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product: ", error);
    } finally {
    }
  };

  const closeModel = () => setAddModal(false);
  return (
    <ScreenWrapper scrollEnabled={false}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setAddModal(true)}
          style={styles.flotbtn}
        >
          <AntDesign
            name={"pluscircle"}
            color={Color.primaryColor}
            size={height(5)}
          />
        </TouchableOpacity>
        <FlatList
          data={categories}
          showsVerticalScrollIndicator={false}
          onRefresh={() => fetchCategories()}
          refreshing={false}
          renderItem={({ item }) => (
            <View style={styles.rowContainer}>
              <Text style={{ fontSize: height(2), fontWeight: "heavy" }}>
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <AntDesign
                  name={"delete"}
                  color={Color.primaryColor}
                  size={height(3)} 
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index}
        />

        <Modal
          animationIn="bounceIn"
          animationOut={"bounceOut"}
          animationOutTiming={800}
          animationInTiming={1000}
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
            {inputError !== "" && (
              <Text style={styles.errorText}>{inputError}</Text>
            )}
            <Button
              isLoading={useSelector(selectAppLoader)}
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
    backgroundColor: Color.backgroundColor,
    margin: height(1),
    padding: height(1.5),
    borderRadius: height(3),
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
  flotbtn: {
    position: "absolute",
    bottom: height(6),
    right: height(4),
    backgroundColor: "white",
    zIndex: 1,
    borderRadius: height(4),
  },
  rowContainer: {
    width: width(92),
    backgroundColor: Color.backgroundColor,
    padding: height(2),
    margin: height(0.5),
    borderRadius: height(1),
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddCategoryScreen;
