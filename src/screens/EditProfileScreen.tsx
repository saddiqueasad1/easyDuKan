import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setProfile } from "../redux/slices/profilleSlice";
import ScreenWrapper from "../components/ScreenWrapper";
import { height, width } from "../utills/Dimension";
import { Color } from "../utills/GlobalStyles";
import Button from "../components/button";
import { setAppLoader } from "../redux/slices/loaderSlice";
import { successMessage } from "../utills/GlobalMethods";

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const profile = useSelector((state: RootState) => state.profile);
  const [username, setUsername] = useState(profile.username);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber + "");
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const db = getFirestore();
  const dispatch = useDispatch();
  const saveProfile = async () => {
    try {
      // setLoading(true);
      dispatch(setAppLoader(true));

      await setDoc(doc(db, "users", user.uid), {
        username,
        phoneNumber,
        email,
        address,
      });
      dispatch(
        setProfile({ username, phoneNumber, email, address, userId: user.uid })
      );

      // Alert.alert("Success", "Profile saved successfully!", [
      //   { text: "OK", onPress: () =>  },
      // ]);
      successMessage("Profile Updated")
      navigation.goBack()

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save profile.");
    } finally {
      // setLoading(false);
      dispatch(setAppLoader(false));
    }
  };

  return (
    <ScreenWrapper scrollEnabled>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.text}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.text}>Phone Number</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={false}
        />
        <Text style={styles.text}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.text}>Address</Text>

        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <Button
          title={"Save Profile"}
          onPress={saveProfile}
          containerStyle={{ width: width(90), marginTop: height(3) }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: height(2),
  },
  title: {
    fontSize: height(3),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: height(3),
    color: Color.primaryColor,
  },
  text: {
    textAlign: "left",
    width: "100%",
    fontSize: height(1.8),
    fontWeight: "700",
  },
  input: {
    borderColor: "#ced4da",
    padding: 12,
    marginVertical: width(2),
    borderRadius: height(3),
    backgroundColor: Color.backgroundColor,
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
});

export default EditProfileScreen;
