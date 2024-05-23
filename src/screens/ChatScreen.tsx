// src/screens/ChatScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { ref, onValue, push, getDatabase } from "firebase/database";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { RouteProp } from "@react-navigation/native";
import { IProfile } from "../redux/slices/profilleSlice";

type RootStackParamList = {
  chatPartner: IProfile;
};

export type OtpVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  "chatPartner"
>;

const ChatScreen = ({ route }: { route: OtpVerificationScreenRouteProp }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const database = getDatabase();
  const user = useSelector((state: RootState) => state.user);

  const currentUserID = user.uid;
  console.log("currentUser", currentUserID);

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.entries(data).map(([key, value]) => ({ id: key, ...value }))
        : [];
      setMessages(loadedMessages);
    });
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const messagesRef = ref(database, "messages");
    push(messagesRef, {
      text: newMessage,
      timestamp: Date.now(),
      uid: currentUserID,
    });
    setNewMessage("");
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.uid === currentUserID;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUser : styles.otherUser,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginVertical: 10,
  },
  messagesList: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  currentUser: {
    backgroundColor: "#d1f5d3",
    alignSelf: "flex-end",
  },
  otherUser: {
    backgroundColor: "#e3e3e3",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
