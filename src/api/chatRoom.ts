import { database } from "../utills/firebaseConfig";
import { ref, push, set } from "firebase/database";

export const createRoom = async () => {
  const roomsRef = ref(database, "chatRooms");
  const newRoomRef = push(roomsRef);
  const roomId = newRoomRef.key;

  if (roomId) {
    // Optionally set initial data for the room
    await set(newRoomRef, { createdAt: Date.now() });
  }

  return roomId;
};

// chatService.ts
import { ref, push, set, getDatabase } from "firebase/database";
import { Message } from "../utills/types";

const database = getDatabase();

async function sendMessage(chatId: string, message: Message): Promise<void> {
  try {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, message);
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message: ", error);
  }
}

export { sendMessage };
