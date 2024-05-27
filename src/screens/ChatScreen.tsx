// src/screens/ChatScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  ref,
  onValue,
  push,
  getDatabase,
  query,
  orderByChild,
  equalTo,
  set,
  serverTimestamp,
} from "firebase/database";
import { useSelector } from "react-redux";
import { RouteProp } from "@react-navigation/native";
import { RootState } from "../redux/store";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { sendMessage } from "../api/chatService";
import { createRoom } from "../api/chatRoom";
import { addParticipant } from "../api/participants";
type RootStackParamList = {
  ChatScreen: { userId: string; userName: string };
};

export interface IUser {
  id: string;
  name: string;
  avatar: string;
}
interface QuickReplies {
  type: "radio" | "checkbox";
  values: Reply[];
  keepIt?: boolean;
}
interface Reply {
  title: string;
  value: string;
  messageId?: any;
}
export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: IUser;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}

export type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

const ChatScreen = ({ route }: { route: ChatScreenRouteProp }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);

  const currentUserID = user.uid;
  const recipientId = route.params.userId;
  const database = getDatabase();
  const db = getFirestore();

  useEffect(() => {
    if (!user) return;

    const messagesRef = ref(
      database,
      `users/${user.uid}/chats/${recipientId}/messages`,
    );
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList: IMessage[] = Object.keys(data).map((key) => ({
          _id: key,
          text: data[key].text,
          createdAt: new Date(data[key].createdAt),
          user: data[key].user,
        }));
        setMessages(messagesList.reverse());
      }
    });

    return () => unsubscribe();
  }, [user, recipientId]);

  const onSend = useCallback(
    (messages: IMessage[] = []) => {
      if (!user) return;

      const senderRef = ref(
        database,
        `users/${user.uid}/chats/${recipientId}/messages`
      );
      const recipientRef = ref(
        database,
        `users/${recipientId}/chats/${user.uid}/messages`
      );
      console.log(inputMessage);
      const HandleSendMessage = {
        text: inputMessage,
        createdAt: new Date().toISOString(),
        user: {
          _id: user.uid,
          name: user.email || "Anonymous",
        },
      };

      console.log(HandleSendMessage);

      const HandleSendMessageRef = push(senderRef);
      set(HandleSendMessageRef, HandleSendMessage);

      const newRecipientMessageRef = push(recipientRef);
      set(newRecipientMessageRef, HandleSendMessage);
    },
    [user, recipientId, inputMessage]
  );

  const renderItem = ({ item }) => {
    console.log(item);

    return (
      <View
        style={[
          styles.messageContainer,
          item.senderID === currentUserID
            ? styles.currentUser
            : styles.otherUser,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Retry"
          onPress={() => {
            setError(null);
            setLoading(true);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <Button title="Send" onPress={() => onSend()} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    marginBottom: 10,
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
