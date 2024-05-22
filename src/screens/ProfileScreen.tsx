import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../utills/GlobalStyles";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber + "");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);
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
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const addItem = async () => {
    try {
      const profilesCollectionRef = collection(
        db,
        "users",
        user.uid,
        "products"
      );
      await addDoc(profilesCollectionRef, {
        name: "New Item",
        description: "Item Description",
        unit_price: "0",
        total_quantity: "0",
      });
      fetchItems();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditPrrofile = () => {
    navigation.navigate("EditProfileScreen");
  };

  const headerItem = () => (
    <>
      <View style={styles.body}>
        <View style={styles.profileImage}>
          <FontAwesome5 name="user-tie" size={50} color={Color.primaryColor} />
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPrrofile}
          >
            <FontAwesome5
              name="plus-circle"
              size={24}
              color={Color.primaryColor}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.username}>{email}</Text>
        <Text style={styles.bio}>{phoneNumber}</Text>
        <Text style={styles.bio}>{address}</Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Items</Text>
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.itemsList}
        ListHeaderComponent={headerItem}
        ListEmptyComponent={
          <Text style={styles.noItemsText}>No items available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 20,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  noItemsText: {
    textAlign: "center",
    color: "#6c757d",
    marginVertical: 20,
  },
  itemsList: {
    paddingBottom: 20,
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  itemText: {
    fontSize: 16,
    color: "#495057",
  },

  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    position: "absolute",
    top: 10,
    right: -10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    marginVertical: 10,
    marginTop: 30,
    backgroundColor: Color.lightgray,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
  },
});

export default ProfileScreen;
