import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IProfile } from "../utills/types";

const UserScreen = ({ navigation }: { navigation: any }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState<IProfile[]>([]);
  const [fullContacts, setFullContacts] = useState<IProfile[]>([]);
  const db = getFirestore();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContacts = async () => {
    try {
      if (!userId) return;
      setLoading(true);
      const contactsCollection = collection(db, "users", userId, "contacts");
      const contactsSnapshot = await getDocs(contactsCollection);
      const contactsList = contactsSnapshot.docs.map(
        (doc) => doc.data() as IProfile,
      );
      setContacts(contactsList);
      setFullContacts(contactsList);
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching contacts");
    } finally {
      setLoading(false);
    }
  };

  const saveContact = async (profile: IProfile, contactId: string) => {
    try {
      setLoading(true);
      const contactsCollection = collection(db, "users", userId, "contacts");
      await addDoc(contactsCollection, { ...profile, userId: contactId });
      fetchContacts();
    } catch (error) {
      console.log(error);
      setError("An error occurred while saving the contact");
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setPhoneNumber(text);
    if (text === "") {
      // If search input is empty, reset data to full dataset
      setContacts(fullContacts);
    } else {
      // Filter the full dataset based on the search text
      const filteredData = fullContacts.filter((item) =>
        item.phoneNumber.toLowerCase().includes(text.toLowerCase()),
      );
      setContacts(filteredData);
    }
  };

  const fetchProfile = async () => {
    try {
      setError("");
      if (contacts.some((contact) => contact.phoneNumber === phoneNumber)) {
        return;
      }
      setLoading(true);

      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docs = querySnapshot.docs;
        const fetchedProfile = docs[0].data() as IProfile;
        const contactId = docs[0].id;

        Alert.alert(
          "Confirm Add",
          `Do you want to add ${fetchedProfile.username} to your contacts?`,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => saveContact(fetchedProfile, contactId),
            },
          ],
          { cancelable: false },
        );

        setError("");
      } else {
        setError("Contacts not found");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching the Contacts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          // onChangeText={(text) => setPhoneNumber(text)}
          onChangeText={handleSearch}
          value={phoneNumber}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
        />
        <Button onPress={fetchProfile} title="Search" color="#007AFF" />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.contactsContainer}>
        <Text style={styles.contactsTitle}>Contacts List</Text>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.phoneNumber}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("ChatScreen", item)}
              >
                <View style={styles.contactItem}>
                  <Text style={styles.contactText}>Name: {item.username}</Text>
                  <Text style={styles.contactText}>Email: {item.email}</Text>
                  <Text style={styles.contactText}>
                    Phone: {item.phoneNumber}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 70,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  profileContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  profileText: {
    marginBottom: 10,
  },
  contactsContainer: {
    marginTop: 20,
    flex: 1,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  contactItem: {
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  contactText: {
    fontSize: 16,
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

export default UserScreen;
