import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { IProfile } from "../redux/slices/profilleSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const UserScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("+923115182891");
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState<IProfile[]>([]);
  const db = getFirestore();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContacts = async () => {
    try {
      if (!userId) return;

      const contactsCollection = collection(db, "users", userId, "contacts");
      const contactsSnapshot = await getDocs(contactsCollection);
      const contactsList = contactsSnapshot.docs.map(
        (doc) => doc.data() as IProfile,
      );
      setContacts(contactsList);
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching contacts");
    }
  };

  const saveContact = async (profile: IProfile, contactId: string) => {
    try {
      const contactsCollection = collection(db, "users", userId, "contacts");
      await addDoc(contactsCollection, { ...profile, userId: contactId });
      fetchContacts();
    } catch (error) {
      console.log(error);
      setError("An error occurred while saving the contact");
    }
  };

  const fetchProfile = async () => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docs = querySnapshot.docs;
        console.log();
        const fetchedProfile = docs[0].data() as IProfile;
        console.log(fetchedProfile);
        const contactId = docs[0].id;
        setProfile(fetchedProfile);
        setError("");
        if (
          !contacts.some(
            (contact) => contact.phoneNumber === fetchedProfile.phoneNumber,
          )
        ) {
          await saveContact(fetchedProfile, contactId);
        } else {
          Alert.alert("Contact already exists");
        }
      } else {
        setProfile(null);
        setError("Profile not found");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching the profile");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
        />
        <Button onPress={fetchProfile} title="Search" color="#007AFF" />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {profile && (
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>Name: {profile.username}</Text>
          <Text style={styles.profileText}>Email: {profile.email}</Text>
        </View>
      )}
      <View style={styles.contactsContainer}>
        <Text style={styles.contactsTitle}>Contacts List</Text>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.phoneNumber}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>Name: {item.username}</Text>
              <Text style={styles.contactText}>Email: {item.email}</Text>
              <Text style={styles.contactText}>Phone: {item.phoneNumber}</Text>
            </View>
          )}
        />
      </View>
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
});

export default UserScreen;
