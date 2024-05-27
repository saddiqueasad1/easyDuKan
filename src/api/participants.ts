// participants.ts
import { database } from "../utills/firebaseConfig";

import { ref, set, onValue, remove } from "firebase/database";
import { Participant } from "../utills/types";



export const addParticipant = async (
  roomId: string,
  participant: Participant,
) => {
  console.log("participant");
  console.log(participant);

  const participantsRef = ref(
    database,
    `chatRooms/${roomId}/participants/${participant.chatPartnerID}`,
  );
  await set(participantsRef, participant);
};

export const removeParticipant = async (roomId: string, userId: string) => {
  const participantRef = ref(
    database,
    `chatRooms/${roomId}/participants/${userId}`
  );
  await remove(participantRef);
};

export const subscribeToParticipants = (
  roomId: string,
  callback: (participants: Participant[]) => void
) => {
  const participantsRef = ref(database, `chatRooms/${roomId}/participants`);
  onValue(participantsRef, (snapshot) => {
    const data = snapshot.val();
    const participants: Participant[] = data ? Object.values(data) : [];
    callback(participants);
  });
};
