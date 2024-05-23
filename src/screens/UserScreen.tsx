import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { IProfile } from "../redux/slices/profilleSlice";

const UserScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("+923115182891");
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [error, setError] = useState("");
  const db = getFirestore();

  const fetchProfile = async () => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        //git product
        // for (const userDoc of querySnapshot.docs) {
        //   // Assuming each user document has a sub-collection named 'products'
        //   const productsCollectionRef = collection(userDoc.ref, "products");
        //   const productsSnapshot = await getDocs(productsCollectionRef);

        //   if (!productsSnapshot.empty) {
        //     productsSnapshot.forEach((productDoc) => {
        //       console.log(
        //         `Product ID: ${productDoc.id}, Product Data:`,
        //         productDoc.data(),
        //       );
        //     });
        //   } else {
        //     console.log(`No products found for user ID: ${userDoc.id}`);
        //   }
        // }

        const docs = querySnapshot.docs;
        setProfile(docs[0].data() as IProfile);
        setError("");
      } else {
        setProfile(null); // Reset profile if not found
        setError("Profile not found");
      }
    } catch (error) {
      console.log(error);
      // Error fetching profile
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
      />
      <Button onPress={fetchProfile} title="Search" color="#007AFF" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {profile && (
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>Name: {profile.username}</Text>
          <Text style={styles.profileText}>Email: {profile.email}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  profileContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  profileText: {
    marginBottom: 10,
  },
});

export default UserScreen;
