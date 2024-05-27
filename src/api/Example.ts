// main.ts
import { sendMessage, subscribeToMessages } from "./chatService";
import {
  addParticipant,
  removeParticipant,
  subscribeToParticipants,
} from "./participants";
import { getTimestamp } from "./utils";
import { IMessage } from "../utills/types";

const roomId = "exampleRoomId";
const userId = "user123";
const userName = "John Doe";

// Add participant
addParticipant(roomId, { userId, userName })
  .then(() => {
    console.log("Participant added!");
  })
  .catch((error) => {
    console.error("Error adding participant:", error);
  });

// Send a message
const message = {
  userId,
  userName,
  text: "Hello, world!",
  timestamp: getTimestamp(),
};

sendMessage(roomId, message)
  .then(() => {
    console.log("Message sent!");
  })
  .catch((error) => {
    console.error("Error sending message:", error);
  });

// Listen for new messages
subscribeToMessages(roomId, (messages: IMessage[]) => {
  console.log("Received messages:", messages);
});

// Listen for participants
subscribeToParticipants(roomId, (participants) => {
  console.log("Current participants:", participants);
});

// Remove participant when user leaves
window.addEventListener("beforeunload", () => {
  removeParticipant(roomId, userId)
    .then(() => {
      console.log("Participant removed!");
    })
    .catch((error) => {
      console.error("Error removing participant:", error);
    });
});
