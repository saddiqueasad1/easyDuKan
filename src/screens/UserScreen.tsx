import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IProfile } from "../utills/types";
import AntDesign from "@expo/vector-icons/AntDesign";

import ChatIcon from "../components/ChatIcon";
import { setAllContacts } from "../redux/slices/contactsSlice";
import ContactView from "../components/contactView";
import { height, width } from "../utills/Dimension";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Head";
import { Color } from "../utills/GlobalStyles";
import Button from "../components/button";
import ContentLoader from "react-native-easy-content-loader";

const UserScreen = ({ navigation }: { navigation: any }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [addModal, setAddModal] = useState(false);

  const [contacts, setContacts] = useState<IProfile[]>([]);
  const [fullContacts, setFullContacts] = useState<IProfile[]>([]);
  const db = getFirestore();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // console.log("user========");
  console.log(userId);

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
        (doc) => doc.data() as IProfile
      );
      setContacts(contactsList);
      setFullContacts(contactsList);
      dispatch(setAllContacts(contactsList));
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
        item.phoneNumber.toLowerCase().includes(text.toLowerCase())
      );
      setContacts(filteredData);
    }
  };
  const closeModel = () => setAddModal(false);
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
          { cancelable: false }
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
    <ScreenWrapper
      headerUnScrollable={() => (
        <Header searchText={searchText} setSearchText={setSearchText} />
      )}
    >
      <View style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.contactsContainer}>
          <Text style={styles.contactsTitle}>Contacts List</Text>
          <FlatList
            data={contacts.filter((a) => {
              return (
                a?.username
                  ?.toLowerCase()
                  ?.includes(searchText?.toLowerCase()) ||
                a?.phoneNumber
                  ?.toLowerCase()
                  ?.includes(searchText?.toLowerCase())
              );
            })}
            keyExtractor={(item) => item?.phoneNumber}
            renderItem={({ item }) => <ContactView data={item} />}
            ListEmptyComponent={
              loading ? (
                <ContentLoader
                  // key={index}
                  containerStyles={{ padding: height(1) }}
                  active
                  avatar
                  aSize={height(8)}
                  pRows={2}
                  tWidth={width(73)}
                  tHeight={height(2)}
                  pHeight={[height(1), height(1)]}
                  pWidth={[width(60), width(70)]}
                />
              ) : (
                <View></View>
              )
            }
          />
        </View>
        <TouchableOpacity
          onPress={() => setAddModal(true)}
          style={{
            position: "absolute",
            bottom: height(5),
            right: height(3),
            backgroundColor: "white",
          }}
        >
          <AntDesign
            name={"pluscircle"}
            color={Color.primaryColor}
            size={height(5)}
          />
        </TouchableOpacity>
        <Modal
           animationIn='bounceIn'
           animationOut={'bounceOut'}
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
              // onChangeText={(text) => setPhoneNumber(text)}
              onChangeText={handleSearch}
              value={phoneNumber}
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
            />
            <Button
              title="Search"
              onPress={fetchProfile}
              containerStyle={{ width: width(20) }}
            />
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width(1),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
    height: height(10),
    borderRadius: height(3),
    padding: height(2),
  },
  input: {
    flex: 1,

    borderRadius: height(3),
    backgroundColor: Color.backgroundColor,
    padding: height(2),
    marginHorizontal: height(1),
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  contactsContainer: {
    marginTop: 20,
    flex: 1,
  },
  contactsTitle: {
    fontSize: height(2.5),
    fontWeight: "bold",
    marginHorizontal: width(3),
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
