import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { clearUser } from "../redux/slices/userSlice";

const SettingScreen = () => {
  const user = useSelector((state: RootState) => state.user);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const db = getFirestore();
  const dispatch = useDispatch();

  const saveProfile = async () => {
    console.log("save profile");
    try {
      const res = await setDoc(doc(db, "users", user.uid), {
        username,
        phoneNumber,
        email,
        address,
      });
      console.log("res", res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = () => {
    console.log("logout");
    dispatch(clearUser());
  };

  return (
    <View style={{ flex: 1, marginTop: 150, gap: 50 }}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={(text) => setAddress(text)}
      />
      <Button title="Save Profile" onPress={saveProfile} />
      <Button title="Logout =" onPress={handleLogout} />
    </View>
  );
};

export default SettingScreen;
