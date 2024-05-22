import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { clearUser } from "../redux/slices/userSlice";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber + "");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);
  const db = getFirestore();
  const dispatch = useDispatch();

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
    fetchItems();
  }, [user.uid, db]);

  const fetchItems = async () => {
    try {
      const itemsCollectionRef = collection(db, "users", user.uid, "products");
      const itemsSnapshot = await getDocs(itemsCollectionRef);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsList as []);
    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = async () => {
    try {
      await setDoc(doc(db, "users", user.uid, "profile", "details"), {
        username,
        phoneNumber,
        email,
        address,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("EditItemScreen", {
          userId: user.uid,
          itemId: item.id,
        })
      }
    >
      <View style={styles.item}>
        <Text style={styles.itemText}>Name: {item.name}</Text>
        <Text style={styles.itemText}>Description: {item.description}</Text>
        <Text style={styles.itemText}>Unit Price: {item.unit_price}</Text>
        <Text style={styles.itemText}>
          Total Quantity: {item.total_quantity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const saveItems = async () => {
    try {
      const profilesCollectionRef = collection(
        db,
        "users",
        user.uid,
        "products",
      );
      await addDoc(profilesCollectionRef, {
        name: "phone 3",
        description: "phone 2",
        unit_price: "10",
        total_quantity: "10",
      });
      // Fetch items again after adding
      fetchItems();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
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
      <Button title="Save Profile" onPress={saveProfile} />
      <Button title="Save items" onPress={saveItems} />
      <Text style={styles.sectionTitle}>Items</Text>
      {items.length === 0 ? (
        <Text>No items available</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
  },
});

export default ProfileScreen;
