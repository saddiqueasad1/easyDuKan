import {
  get,
  getDatabase,
  off,
  onValue,
  ref,
  remove,
  set,
} from "firebase/database";
import {
  deleteObject,
  getStorage,
  listAll,
  ref as storageRef,
} from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Platform, FlatList, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
//   import { getUserForChat } from "../../../backend/auth";
//   import { ChatHeader, ChatIcon, ScreenWrapper } from "../../../components";

// import * as Notifications from "expo-notifications";
// import { getAdForChat } from "../../../backend/api";
// import Header from "../../../components/header";
import { setNewChat } from "../redux/slices/chatSlice";
import {
  selectChatRedux,
  selectChatRooms,
  setChatRedux,
  setChatRooms,
} from "../redux/slices/chatSlice";
// import { ThemeContext } from "../../../theme";
import { height, width } from "../utills/Dimension";
// import getStyles from "./styles";
import ContentLoader from "react-native-easy-content-loader";
import ScreenWrapper from "../components/ScreenWrapper";
import ChatIcon from "../components/ChatIcon";
import { Color as AppColors } from "../utills/GlobalStyles";
export default function ChatList({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const db = getDatabase();
  const dbStore = getFirestore();
  const storage = getStorage();
  const user = useSelector((state: RootState) => state.profile);
  // const { AppColors } = useContext(ThemeContext);
  const styles = getStyles(AppColors);
  const allRooms = useSelector(selectChatRooms) || [];
  const Chat = useSelector(selectChatRedux);
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [mutedList, setMutedList] = useState([]);
  useFocusEffect(
    useCallback(() => {
      fetchRooms(user?.userId);
      // fetchMutedRooms(user?.userId);
    }, [user?.userId])
  );
  const fetchRooms = async (userId) => {
    try {
      let roomRef = ref(db, `users/${userId}/rooms`);
      const handleRoomUpdate = (snapshot) => {
        const room = snapshot.val() || [];
        // console.log("all rooms ", room);

        dispatch(setChatRooms(room));
      };
      onValue(roomRef, handleRoomUpdate);
      return () => {
        if (roomRef) {
          off(roomRef, handleRoomUpdate);
        }
      };
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };
  // const fetchMutedRooms = async (userId) => {
  //   try {
  //     let roomRef = ref(db, `users/${userId}/mutedRoom`);

  //     const handleRoomUpdate = (snapshot) => {
  //       const room = snapshot.val() || [];
  //       setMutedList(room);
  //     };
  //     onValue(roomRef, handleRoomUpdate);
  //     return () => {
  //       if (roomRef) {
  //         off(roomRef, handleRoomUpdate);
  //       }
  //     };
  //   } catch (error) {
  //     console.error("Error fetching room data:", error);
  //   }
  // };

  const fetchData = async (data) => {
    try {
      if (user) {
        const search =
          user.userId === data.split("_")[0]
            ? data.split("_")[1]
            : data.split("_")[0];
        console.log(search);

        const fetchedUser = await fetchProfile(search);
        const response = fetchedUser;
        return response;
      } else {
        return null;
      }
    } catch (error) {}
  };
  const fetchProfile = async (id) => {
    try {
      const docRef = doc(dbStore, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const newData = { ...data, userId: id };
        return newData;
      }
      return undefined;
    } catch (error) {
      console.log(error);
    }
  };
  const myFunction = async (data) => {
    try {
      let lastmsg = {};
      const lastReadRef = await ref(
        db,
        `chatrooms/${data}/lastRead/${user?.userId}`
      );

      // Assuming you're using Firebase Realtime Database
      const snapshot = await get(lastReadRef);
      const lastReadTimestamp = await snapshot.val();
      const messagesRef = ref(db, `chatrooms/${data}/messages`);
      onValue(messagesRef, (snapshot) => {
        const messageData = snapshot.val();

        if (messageData) {
          const messageList = Object.values(messageData);
          lastmsg = messageList[messageList.length - 1];
        }
      });

      return { lastmsg, readd: lastReadTimestamp < lastmsg?.timestamp };
    } catch (error) {}
  };
  const setRooms = async (roomId, id) => {
    try {
      const userRef = ref(db, `users/${id}/rooms`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const currentRooms = snapshot.val() || [];

        // Filter out the room to be removed
        const updatedRooms = currentRooms?.filter((room) => room !== roomId);

        // Update the user's data with the updated rooms array
        await set(userRef, updatedRooms);
      }
    } catch (error) {}
  };
  // const setBadge = async (roomId, id) => {
  //   try {
  //     const userRef = ref(db, `users/${id}/badge`);
  //     const snapshot = await get(userRef);

  //     if (snapshot.exists()) {
  //       const currentRooms = snapshot.val() || [];

  //       // Filter out the room to be removed
  //       const updatedRooms = currentRooms?.filter((room) => room !== roomId);

  //       // Update the user's data with the updated rooms array
  //       await set(userRef, updatedRooms);
  //     }
  //   } catch (error) {}
  // };
  const deleteChatroom = async (chatroomId) => {
    try {
      const lastReadRef = ref(db, `chatrooms/${chatroomId}`);
      const imagesRef = storageRef(storage, `chatrooms/${chatroomId}/images`);

      // List all the images in the folder and delete them
      const imagesSnapshot = await listAll(imagesRef);
      const deletePromises = imagesSnapshot?.items?.map((imageRef) =>
        deleteObject(imageRef)
      );
      await Promise.all(deletePromises);

      // Remove the chatroom from the database
      await setRooms(chatroomId, user?.userId);
      // await setBadge(chatroomId, user?.userId);
      await remove(lastReadRef);

      console.log(
        `Chatroom ${chatroomId} and its images deleted successfully.`
      );
    } catch (error) {
      console.error("Error deleting chatroom:", error.message);
      // Handle errors as needed
    }
  };
  const promisFuntion = async () => {
    // console.log(Chat);

    try {
      setLoading(true);
      const promises = allRooms?.map(async (element) => {
        let u = Chat.find((i) => element === i?.roomId)
          ? Chat.find((i) => element === i.roomId)?.user
          : await fetchData(element);
        let l = await myFunction(element);
        return {
          roomId: element,
          user: u,
          lastmsg: l?.lastmsg,
          read: l?.readd,
        };
      });

      const newData = await Promise.all(promises);
      if (newData.find((item) => item?.read == true)) {
        if (user?.userId) dispatch(setNewChat(true));
      } else {
        dispatch(setNewChat(false));
        // await Notifications.setBadgeCountAsync(0);
      }
      dispatch(setChatRedux(newData));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (allRooms) promisFuntion();
  }, [allRooms]);
  const d = ["chat.all", "chat.buying", "chat.selling", "chat.unread"];
  return (
    <ScreenWrapper
      refreshing={loading}
      onRefresh={promisFuntion}
      scrollEnabled
      headerUnScrollable={() => (
        <Header
          searchText={searchText}
          setSearchText={setSearchText}
          showTopHead={false}
        />
      )}
    >
      <View style={styles.mainViewContainer}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Chats
        </Text>
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={
            // select == 3
            //   ? Chat?.filter((item) => item?.product && item?.read === true)
            //   : select == 1
            //     ? Chat?.filter(
            //         (item) =>
            //           item?.product && item?.product?.userId !== user?.userId
            //       )
            //     : select == 2
            //       ? Chat?.filter(
            //           (item) =>
            //             item?.product && item?.product?.userId === user?.userId
            //         )
            //       :
            Chat
          }
          renderItem={({ item }) => {
            if (
              item?.user?.username
                ?.toLowerCase()
                ?.includes(searchText?.toLowerCase()) ||
              item?.user?.phoneNumber
                ?.toLowerCase()
                ?.includes(searchText?.toLowerCase())
            ) {
              return (
                <ChatIcon
                  disable={loading}
                  data={item}
                  mute={mutedList.includes(item?.roomId)}
                />
              );
            }
          }}
          keyExtractor={(item, index) => item?.roomId}
          ListEmptyComponent={() => {
            return !loading ? (
              <View
                style={{
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  height: height(70),
                }}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={width(50)}
                  color="black"
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: height(2),
                    color: "black",
                  }}
                >
                  {t("commmon.nochatMsg")}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  width: width(100),
                }}
              >
                {allRooms.map((item, index) => {
                  return (
                    <ContentLoader
                      key={index}
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
                  );
                })}
              </View>
            );
          }}
        />
      </View>
    </ScreenWrapper>
  );
}
import { StyleSheet } from "react-native";
import { RootState } from "../redux/store";
import Header from "../components/Head";

const getStyles = (AppColors) =>
  StyleSheet.create({
    mainViewContainer: {
      padding: width(1),
      paddingBottom: height(8),
      flex: 1,
      backgroundColor: AppColors.white,
      marginTop: height(1),
      paddingHorizontal: width(3),
    },
  });
