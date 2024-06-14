// import { Linking, Platform, Share, ToastAndroid } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { es, de, it, enUS, fr } from "date-fns/locale";

import { height, width } from "./Dimension";
// export const toastMessage = (message) => {
//   ToastAndroid.show(message, ToastAndroid.SHORT);
// };
import { showMessage } from "react-native-flash-message";
import { Color } from "./GlobalStyles";

export const successMessage = (description = "", message = "success") => {
  showMessage({
    message: message,
    description: description,
    type: "success",
    backgroundColor: Color.primaryColor,
    position: "top",
    statusBarHeight: height(4),
    floating: true,
    duration: 5000,
  });
};
export const errorMessage = (description = "", message = "error") => {
  showMessage({
    message: message,
    description: description,
    type: "danger",
    position: "top",
    statusBarHeight: height(4),
    floating: true,
    duration: 5000,
  });
};
export const infoMessage = (description = "", message = "info") => {
  showMessage({
    message: message,
    description: description,
    type: "info",
    position: "top",
    statusBarHeight: height(4),
    floating: true,
    duration: 5000,
  });
};

// const onPressCall = (phoneNumber) => {
//   const url =
//     Platform.OS == "ios" ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

//   Linking.openURL(url)
//     .then((result) => {
//       if (result) {
//         console.log("Phone app opened successfully");
//       } else {
//         console.log("Unable to open phone app");
//       }
//     })
//     .catch((error) => console.error("Error opening phone app:", error));
// };
// const onPressEmail = (email, mymail, message = "") => {
//   const subject = `${message}`; // Optional: Replace with the subject of your email

//   const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
//   `mailto:${email}?subject=${encodeURIComponent(
//     subject
//   )}&cc=${encodeURIComponent(mymail)}`;

//   Linking.openURL(url)
//     .then((result) => {
//       if (result) {
//         console.log("Email app opened successfully");
//       } else {
//         console.log("Unable to open email app");
//       }
//     })
//     .catch((error) => console.error("Error opening email app:", error));
// };
// const onPressShare = async (id, title) => {
//   let message = `${WebLink}`;
//   try {
//     const result = await Share.share({
//       message: Platform.OS == "android" && `${title}\n${message}`,
//       title: "Eidcarosse",
//       url: message,
//     });
//   } catch (error) {
//     console.error("Error sharing:", error);
//   }
// };

// const openWhatsApp = (phoneNumber) => {
//   // Construct the WhatsApp URL
//   const whatsappURL = `whatsapp://send?phone=${phoneNumber}`;

//   // Open WhatsApp with the constructed URL
//   Linking.openURL(whatsappURL)
//     .then(() => {
//       console.log("WhatsApp opened successfully");
//     })
//     .catch((error) => {
//       console.error("Error opening WhatsApp:", error);
//       errorMessage("Whatsapp not exist");
//     });
// };
// const openWhatsAppChannel = (link) => {
//   Linking.openURL(link)
//     .then(() => {
//       console.log("WhatsApp opened successfully");
//     })
//     .catch((error) => {
//       Linking.openURL("https://whatsapp.com");
//       console.error("Error opening WhatsApp CHANEL", error);
//     });
// };

const calculateTimeDifference = (createdAt, l) => {
  let locale;
  switch (l) {
    case "fr":
      locale = fr;
      break;
    case "de":
      locale = de;
      break;
    case "it":
      locale = it;
      break;
    case "es":
      locale = es;
      break;
    case "en":
      locale = enUS;
      break;
    default:
      locale = de;
  }
  const distance = formatDistanceToNow(new Date(createdAt), {
    locale,
    addSuffix: true,
  });
  return distance;
};

const GlobalMethods = {
  calculateTimeDifference,
};
export default GlobalMethods;
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   TextInput,
//   Text,
//   StyleSheet,
//   Alert,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import DraggableFlatList, {
//   ScaleDecorator,
// } from "react-native-draggable-flatlist";
// import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
// import FilePickerModal from "../components/filepiker";
// import { Picker } from "@react-native-picker/picker";
// import {
//   doc,
//   setDoc,
//   collection,
//   getDocs,
//   addDoc,
//   getFirestore,
// } from "firebase/firestore";
// import {
//   deleteObject,
//   getDownloadURL,
//   getStorage,
//   ref as storageRef,
//   uploadBytes,
// } from "@firebase/storage";
// import { useDispatch, useSelector } from "react-redux";
// import { setCategories } from "../redux/slices/categoriesSlice";
// import { RootState } from "../redux/store";
// import { addProduct, updateProduct } from "../redux/slices/productSlice";
// import { IProduct } from "../utills/types";
// import ScreenWrapper from "../components/ScreenWrapper";
// import { height, width } from "../utills/Dimension";
// import { Color } from "../utills/GlobalStyles";
// import Button from "../components/button";
// import { setAppLoader } from "../redux/slices/loaderSlice";
// import { successMessage } from "../utills/GlobalMethods";

// const EditProductScreen = ({
//   route,
//   navigation,
// }: {
//   route: any;
//   navigation: any;
// }) => {
//   const user = useSelector((state: RootState) => state.user);
//   const Profile = useSelector((state: RootState) => state.profile);
//   const userId = user.uid;
//   const { itemId } = route.params;
//   const dispatch = useDispatch();
//   const { categories } = useSelector((state: RootState) => state.categories);
//   const products = useSelector((state: RootState) => state.products);
//   const selectedBranchId = user.selectedBranchId;
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [unitPrice, setUnitPrice] = useState(0);
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const [purchasePrice, setPurchasePrice] = useState(0);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const imageRef = useRef(null);
//   const [image, setImage] = useState([]);
//   const [inputErrors, setInputErrors] = useState({
//     name: "",
//     description: "",
//     unitPrice: "",
//     totalQuantity: "",
//     purchasePrice: "",
//   });
//   const db = getFirestore();
//   async function getBlobFromFile(imageUri) {
//     return (await fetch(imageUri)).blob();
//   }
//   const saveImages = async () => {
//     try {
//       dispatch(setAppLoader(true));
//       const imageUrls = [];
//       const storage = getStorage();

//       for (const imageUri of image) {
//         const split = imageUri.split("/");
//         const name = split.pop();
//         const imageRef = storageRef(
//           storage,
//           `product/${Profile?.selectedBranchId}/images/${name}`
//         );

//         const metadata = {
//           contentType: "image/jpeg",
//         };

//         // // Get the blob from the image URI
//         try {
//           const imageBlob = await getBlobFromFile(imageUri);

//           const uploadTask = await uploadBytes(
//             imageRef,
//             imageBlob,
//             metadata
//           ).catch((err) => {
//             console.log("Error uploading images:", err);
//           });
//           const snapshot = await uploadTask;

//           if (snapshot) {
//             const downloadUrl = await getDownloadURL(imageRef);
//             if (downloadUrl) {
//               imageUrls.push(downloadUrl);
//             }
//           }
//         } catch (error) {
//           console.log("Error uploading images:", error);
//           dispatch(setAppLoader(false));
//         }
//       }

//       // dispatch(setAppLoader(false));
//       setImage([]);
//       return imageUrls;
//     } catch (error) {
//       console.log("muktipule iamge", error);
//     }
//   };
//   useEffect(() => {
//     navigation.setOptions({
//       title: itemId ? "Edit Product" : "Add Product",
//     });
//     const fetchItem = async () => {
//       if (itemId) {
//         dispatch(setAppLoader(true));
//         try {
//           const selectProductById: IProduct | undefined = products.find(
//             (product) => product.id === itemId
//           );
//           if (selectProductById) {
//             setName(selectProductById.name || "");
//             setDescription(selectProductById.description);
//             setUnitPrice(selectProductById.unitPrice);
//             setTotalQuantity(selectProductById.totalQuantity);
//             setSelectedCategoryId(selectProductById.category_id || "");
//             // setImage(selectProductById?.images || []);
//           } else {
//             // Handle case when no product is found with the given id
//             console.log("Product not found");
//           }
//         } catch (error) {
//           console.log(error);
//         } finally {
//           dispatch(setAppLoader(false));
//         }
//       }
//     };

//     const fetchCategories = async () => {
//       dispatch(setAppLoader(true));

//       try {
//         const categoriesSnapshot = await getDocs(
//           collection(db, "branches", selectedBranchId, "categories"),
//         );
//         const categoriesList = categoriesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         dispatch(setCategories(categoriesList as any));
//       } catch (error) {
//         console.log(error);
//       } finally {
//         dispatch(setAppLoader(false));
//       }
//     };

//     fetchItem();
//     fetchCategories();
//   }, [userId, itemId, db, dispatch, navigation, products]);

//   const validateInputs = () => {
//     let valid = true;
//     let errors = {
//       name: "",
//       description: "",
//       unitPrice: "",
//       totalQuantity: "",
//       purchasePrice: "",
//     };

//     if (!name.trim()) {
//       errors.name = "Name is required.";
//       valid = false;
//     }
//     if (!description.trim()) {
//       errors.description = "Description is required.";
//       valid = false;
//     }
//     if (!unitPrice || isNaN(Number(unitPrice))) {
//       errors.unitPrice = "Valid unit price is required.";
//       valid = false;
//     }
//     if (!totalQuantity || isNaN(Number(totalQuantity))) {
//       errors.totalQuantity = "Valid total quantity is required.";
//       valid = false;
//     }
//     if (!purchasePrice || isNaN(Number(purchasePrice))) {
//       errors.purchasePrice = "Valid total purchase Price is required.";
//       valid = false;
//     }

//     setInputErrors(errors);
//     return valid;
//   };

//   const saveItem = async () => {
//     if (!validateInputs()) {
//       return;
//     }
//     dispatch(setAppLoader(true));

//     try {
//       if (itemId) {
//         await setDoc(doc(db, "users", userId, "products", itemId), {
//           name,
//           description,
//           unitPrice: unitPrice,
//           totalQuantity: totalQuantity,
//           category_id: selectedCategoryId,
//           purchasePrice: purchasePrice,
//         });
//         Alert.alert("Success", "Prodduct updated successfully!", [
//           { text: "OK", onPress: () => navigation.goBack() },
//         ]);
//         dispatch(
//           updateProduct({
//             name,
//             description,
//             unitPrice: unitPrice,
//             totalQuantity: totalQuantity,
//             category_id: selectedCategoryId,
//             id: itemId,
//             purchasePrice: purchasePrice,
//           }),
//         );
//       } else {
//         const result = await addDoc(
//           collection(db, "branches", selectedBranchId, "products"),
//           {
//             name,
//             description,
//             unitPrice: unitPrice,
//             totalQuantity: totalQuantity,
//             category_id: selectedCategoryId,
//             purchasePrice: purchasePrice,
//           }
//         );
//         dispatch(
//           addProduct({
//             name,
//             description,
//             unitPrice: unitPrice,
//             totalQuantity: totalQuantity,
//             category_id: selectedCategoryId,
//             purchasePrice: purchasePrice,
//             id: result.id,
//           })
//         );
//         // Alert.alert("Success", "Product added successfully!", [
//         //   { text: "Add More" },
//         //   { text: "OK", onPress: () =>  },
//         // ]);
//         navigation.goBack();
//         successMessage("New Product Added");
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Failed to save Product.");
//     } finally {
//       dispatch(setAppLoader(false));
//     }
//   };
//   const renderItem = ({ item, drag, isActive }) => (
//     <ScaleDecorator>
//       <TouchableOpacity
//         onLongPress={drag}
//         disabled={isActive}
//         style={{ flexDirection: "row" }}
//       >
//         <Image
//           style={{
//             height: height(7),
//             width: height(7),
//             borderRadius: height(1),
//             marginLeft: width(3),
//           }}
//           source={{ uri: item }}
//         />
//         <TouchableOpacity
//           onPress={() => {
//             let temp;
//             temp = image.filter((i) => i !== item);
//             setImage(temp);
//           }}
//           style={{ height: height(3) }}
//         >
//           <Entypo
//             name="squared-cross"
//             size={height(2)}
//             color={Color.primaryColor}
//           />
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </ScaleDecorator>
//   );
//   const handleInputChange = (key: string, value: string) => {
//     setInputErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
//     switch (key) {
//       case "name":
//         setName(value);
//         break;
//       case "description":
//         setDescription(value);
//         break;
//       case "unitPrice":
//         setUnitPrice(Number(value));
//         break;
//       case "totalQuantity":
//         setTotalQuantity(Number(value));
//         break;
//       case "purchasePrice":
//         setPurchasePrice(Number(value));
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <ScreenWrapper scrollEnabled>
//       <View style={styles.container}>
//         {categories.length > 0 ? (
//           <View
//             style={{
//               backgroundColor: Color.backgroundColor,
//               padding: height(2),
//               borderRadius: height(3),
//               marginBottom: height(5),
//             }}
//           >
//             <View
//               style={{ flexDirection: "row", justifyContent: "space-between" }}
//             >
//               <Text
//                 style={{
//                   textAlign: "center",
//                   fontSize: height(2),
//                   fontWeight: "600",
//                 }}
//               >
//                 Select Category
//               </Text>
//               <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate("AddCategoryScreen", { add: true })
//                 }
//               >
//                 <AntDesign
//                   name={"pluscircle"}
//                   color={Color.primaryColor}
//                   size={height(2.5)}
//                 />
//               </TouchableOpacity>
//             </View>
//             <Picker
//               style={{
//                 padding: height(1),
//                 marginVertical: height(1),
//                 borderRadius: height(3),
//                 width: width(90),
//                 backgroundColor: "white",
//               }}
//               selectedValue={selectedCategoryId}
//               onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
//             >
//               {categories.map((category: any) => (
//                 <Picker.Item
//                   label={category.name}
//                   value={category.id}
//                   key={category.id}
//                 />
//               ))}
//             </Picker>
//             {/* <Button
//             title="Add New Category"
//             onPress={() => navigation.navigate("AddCategoryScreen")}
//           /> */}
//           </View>
//         ) : (
//           <TouchableOpacity
//             onPress={() =>
//               navigation.navigate("AddCategoryScreen", { add: true })
//             }
//             style={{
//               backgroundColor: Color.backgroundColor,
//               padding: height(2),
//               borderRadius: height(3),
//               marginBottom: height(5),
//               width: width(95),
//             }}
//           >
//             <View
//               style={{ flexDirection: "row", justifyContent: "space-between" }}
//             >
//               <Text
//                 style={{
//                   textAlign: "center",
//                   fontSize: height(2),
//                   fontWeight: "600",
//                 }}
//               >
//                 Add Category
//               </Text>

//               <AntDesign
//                 name={"pluscircle"}
//                 color={Color.primaryColor}
//                 size={height(2.5)}
//               />
//             </View>
//           </TouchableOpacity>
//         )}

//         <View
//           style={{
//             backgroundColor: Color.backgroundColor,
//             borderRadius: width(2),
//             width: width(90),
//             alignContent: "center",
//             alignItems: "center",
//             paddingVertical: height(2),
//             marginBottom: height(2),
//           }}
//         >
//           {!(image != null && image.length > 0) ? (
//             <View
//               style={{ justifyContent: "space-around", alignItems: "center" }}
//             >
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: Color.primaryColor,
//                   borderRadius: width(2),
//                   padding: height(1),
//                 }}
//                 onPress={() => imageRef.current.show()}
//               >
//                 <Ionicons name="camera" size={height(7)} color={"white"} />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={{ flex: 1 }}>
//               <DraggableFlatList
//                 data={image}
//                 horizontal
//                 style={{ marginHorizontal: width(2) }}
//                 onDragEnd={({ data }) => setImage(data)}
//                 keyExtractor={(index, item) => {
//                   return `key-${index}`;
//                 }}
//                 renderItem={renderItem}
//                 ListHeaderComponent={
//                   image?.length < 3 && (
//                     <TouchableOpacity
//                       style={{
//                         backgroundColor: Color.primaryColor,
//                         height: height(7),
//                         width: height(7),
//                         borderRadius: height(1),
//                         alignSelf: "center",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}
//                       onPress={() => imageRef.current.show()}
//                     >
//                       <Ionicons name="add" size={height(4)} color={"white"} />
//                     </TouchableOpacity>
//                   )
//                 }
//               />
//             </View>
//           )}
//           {image.length <= 0 ? (
//             <>
//               <Text
//                 style={{
//                   fontWeight: "bold",
//                   fontSize: height(2),
//                   padding: width(3),
//                   color: Color.black,
//                 }}
//               >
//                 Attach Images
//               </Text>
//             </>
//           ) : (
//             <Text
//               style={{
//                 fontSize: height(1.2),
//                 paddingTop: height(3),
//                 color: Color.black,
//               }}
//             >
//               Maximum 3 Images
//             </Text>
//           )}
//         </View>

//         <Text style={styles.text}>Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={name}
//           onChangeText={(value) => handleInputChange("name", value)}
//         />
//         {inputErrors.name !== "" && (
//           <Text style={styles.errorText}>{inputErrors.name}</Text>
//         )}
//         <Text style={styles.text}>Description</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Description"
//           value={description}
//           onChangeText={(value) => handleInputChange("description", value)}
//         />
//         {inputErrors.description !== "" && (
//           <Text style={styles.errorText}>{inputErrors.description}</Text>
//         )}
//         <Text style={styles.text}>Unit Price</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Unit Price"
//           keyboardType="numeric"
//           value={unitPrice + ""}
//           onChangeText={(value) => handleInputChange("unitPrice", value)}
//         />
//         {inputErrors.unitPrice !== "" && (
//           <Text style={styles.errorText}>{inputErrors.unitPrice}</Text>
//         )}
//         <Text style={styles.text}>Total Quantity</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Total Quantity"
//           keyboardType="numeric"
//           value={totalQuantity + ""}
//           onChangeText={(value) => handleInputChange("totalQuantity", value)}
//         />
//         {inputErrors.totalQuantity !== "" && (
//           <Text style={styles.errorText}>{inputErrors.totalQuantity}</Text>
//         )}
//         <Text style={styles.text}>Purchase Price</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Purchase Price"
//           keyboardType="numeric"
//           value={purchasePrice + ""}
//           onChangeText={(value) => handleInputChange("purchasePrice", value)}
//         />
//         {inputErrors.purchasePrice !== "" && (
//           <Text style={styles.errorText}>{inputErrors.purchasePrice}</Text>
//         )}

//         <View style={styles.buttonContainer}>
//           <Button
//             title="Save Item"
//             onPress={saveItem}
//             containerStyle={{ width: width(90), marginTop: height(3) }}
//           />
//         </View>
//       </View>
//       <FilePickerModal
//         ref={imageRef}
//         multi={true}
//         onFilesSelected={(img) => {
//           const selectedImages = img.map((imageUri) => {
//             return Platform.OS === "android"
//               ? imageUri.uri
//               : imageUri.uri.replace("file://", "");
//           });
//           const combinedImages = [...image, ...selectedImages];

//           // If the total number of images exceeds 7, slice the array to keep only the first 7
//           const limitedImages = combinedImages.slice(0, 3);

//           // Update the state with the limited images
//           setImage(limitedImages);
//         }}
//       />
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: height(2),
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingContainer: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.7)",
//     zIndex: 1,
//   },
//   text: {
//     textAlign: "left",
//     width: "100%",
//     fontSize: height(1.8),
//     fontWeight: "500",
//   },
//   input: {
//     padding: height(1),
//     marginVertical: height(1),
//     borderRadius: height(3),
//     width: width(94),
//     backgroundColor: Color.backgroundColor,
//   },
//   errorText: {
//     color: "red",
//     marginBottom: 5,
//   },
// });

// export default EditProductScreen;
