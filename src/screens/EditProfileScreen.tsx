import React, { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber + "");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const db = getFirestore();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid, "profile", "details");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username);
          setPhoneNumber(data.phoneNumber);
          setEmail(data.email);
          setAddress(data.address);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, [user.uid, db]);

  const saveProfile = async () => {
    try {
      await setDoc(doc(db, "users", user.uid, "profile", "details"), {
        username,
        phoneNumber,
        email,
        address,
      });
      Alert.alert("Success", "Profile saved successfully!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#343a40",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
