import { getDatabase, ref, push, set, onValue } from "firebase/database";
import { database } from "../utills/firebaseConfig";

const chatsRef = ref(database, "chats");

export interface Message {
  messageId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export const sendMessage = async (
  roomId: string,
  message: Omit<Message, "messageId">,
) => {
  const messagesRef = ref(database, `chatRooms/${roomId}/messages`);
  const newMessageRef = push(messagesRef);
  const messageId = newMessageRef.key;

  if (messageId) {
    await set(newMessageRef, { ...message, messageId });
  }
};

export const subscribeToMessages = (
  roomId: string,
  callback: (messages: Message[]) => void,
) => {
  const messagesRef = ref(database, `chatRooms/${roomId}/messages`);

  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages: Message[] = data ? Object.values(data) : [];
    callback(messages);
  });
};
