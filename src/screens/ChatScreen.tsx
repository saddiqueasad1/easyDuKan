import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
// import * as Notifications from "expo-notifications";
import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import {
  Actions,
  Bubble,
  Day,
  GiftedChat,
  MessageText,
  Send,
  Time,
  InputToolbar,
} from "react-native-gifted-chat";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modal";
import SwiperFlatList from "react-native-swiper-flatlist";
import { useSelector } from "react-redux";
// import { getDataofAdByID, setRoomIDInMDB } from "../../../backend/api";
// AdView,
// Button,
// DropDownMenu,
import ScreenWrapper from "../components/ScreenWrapper";
import { DeleteView } from "../components/ChatIcon";
// import { selectUserMeta } from "../../../redux/slices/user";
// import ScreenNames from "../../../routes/routes";
// import { ThemeContext } from "../../../theme";
import { height, width } from "../utills/Dimension";
// import getStyles from "./styles";
import { Color as AppColors } from "../utills/GlobalStyles";
import DropDownMenu from "../components/DropDownMenu";
import { RootState } from "../redux/store";
function ChatView({ route }) {
  const { t } = useTranslation();
  // const { AppColors } = useContext(ThemeContext);
  const styles = getStyles(AppColors);
  const imageSendRef = useRef(null);
  const database = getDatabase();
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState();
  const [roomID, setRoomID] = useState(route?.params.userRoom);
  // const [selectedItem, setSelectedItem] = useState(route?.params.userItem);
  const [online, setOnline] = useState();
  const [image, setImage] = useState([]);
  const [imageSelect, setImageSelect] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState();
  const [deletechat, setDeletechat] = useState();
  const [seenmsg, setMsgSeen] = useState();
  const [sendImageLoader, setSendImageLoader] = useState(false);
  const [mutedList, setMutedList] = useState([]);
  const [stater, setStater] = useState(true);
  const [fetchItemLoader, setFetchItemLoader] = useState(false);

  const [badgeNumber, setBadgeNumber] = useState([]);
  const [check, setCheck] = useState(false);

  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.profile);
  const [modal, setModal] = useState(false);
  // useFocusEffect(
  //   useCallback(() => {
  //     const notificationHandler = async () => {
  //       Notifications.setNotificationHandler({
  //         handleNotification: async () => ({
  //           shouldShowAlert: false,
  //           shouldPlaySound: false,
  //           shouldSetBadge: false,
  //         }),
  //       });
  //     };

  //     notificationHandler();
  //     return () => {
  //       Notifications.setNotificationHandler({
  //         handleNotification: async () => ({
  //           shouldShowAlert: true,
  //           shouldPlaySound: true,
  //           shouldSetBadge: true,
  //         }),
  //       });
  //     };
  //   }, [])
  // );
  useEffect(() => {
    // setBadge(roomID, user?.userId);
    // getItems(roomID);
    // getBadgeNumber(route?.params?.user?.userId)
    //   .then((badgeNumber) => {
    //     setBadgeNumber(badgeNumber || []);
    //   })
    //   .catch((error) => {
    //     console.error("Error retrieving badge number:", error);
    //   });
    setTimeout(() => {
      async function a() {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setCheck(status);
      }
      a();
      // fetchMutedRooms(route?.params.usr?.userId);
      setStater(false);
    }, 1200);
  }, []);
  let f = async (roomID, user, database, set) => {
    if (route?.params.userRoom) {
      const lastReadRef = ref(
        database,
        `chatrooms/${roomID}/lastRead/${user?.userId}`
      );
      setTimeout(() => {
        set(lastReadRef, Date.now());
      }, 1000);
    }
  };
  useEffect(() => {
    f(roomID, user, database, set);
  }, [messages.length, roomID, user, database, set]);
  useEffect(() => {
    const lastDeleteRef = ref(
      database,
      roomID
        ? `chatrooms/${roomID}/lastDelete/${user?.userId}`
        : route.params?.userItem?.userId != user?.userId
          ? `chatrooms/${`${user?.userId}_${route.params.usr?.userId}_${route.params?.userItem?._id}`}/lastDelete/${
              user?.userId
            }`
          : `chatrooms/${`${route.params.usr?.userId}_${user?.userId}_${route.params?.userItem?._id}`}/lastDelete/${
              user?.userId
            }`
    );
    onValue(lastDeleteRef, (snapshot) => {
      if (snapshot.exists()) {
        const lastReadData = snapshot.val();
        console.log(lastReadData);
        setDeleteMsg(lastReadData);
      }
    });
  }, []);
  useEffect(() => {
    myfuntion();
  }, [roomID, deleteMsg]);
  useEffect(() => {
    if (!(route?.params?.userRoom == null)) {
      setRoomID(route?.params?.userRoom);
    } else {
      console.log("from", user?.userId, "to", route.params.usr?.userId);

      setRoomID(`${user?.userId}_${route.params.usr?.userId}`);
    }
    setReceiver(route.params?.usr);
  }, []);
  useEffect(() => {
    if (route.params?.usr) {
      const userStatusRef = ref(
        database,
        `users/${route.params?.usr?.userId}/online`
      );
      onValue(userStatusRef, (snapshot) => {
        const status = snapshot.val();
        setOnline(status);
      });
    }
  });

  useEffect(() => {
    if (route.params.usr?.userId) {
      const lastReadRe = ref(
        database,
        `chatrooms/${roomID}/lastRead/${route.params.usr?.userId}`
      );
      onValue(lastReadRe, (snapshot) => {
        if (snapshot.exists()) {
          const lastReadData = snapshot.val();
          const lastRead = lastReadData;
          setMsgSeen(lastRead);
        }
      });
    }
  });

  // useEffect(() => {
  //   if (!selectedItem) {
  //     Alert.alert(t("flashmsg.alert"), t("flashmsg.Ad deleted"), [
  //       { text: "OK", onPress: () => {} },
  //     ]);
  //   }
  // }, [selectedItem]);
  const closeImageModal = () => {
    setModal(false);
  };
  const setBadge = async (roomId, id) => {
    try {
      const userRef = ref(database, `users/${id}/badge`);
      const snapshot = await get(userRef);

      let updatedRooms;

      if (snapshot.exists()) {
        const currentRooms = snapshot.val() || [];
        updatedRooms = currentRooms?.filter((room) => room !== roomId);
        // await Notifications.setBadgeCountAsync(updatedRooms.length);
        // Remove the room from muted rooms
        await set(userRef, updatedRooms);
      }

      // Update the user's data with the updated rooms array
    } catch (error) {
      console.log(error);
    }
  };
  const myfuntion = async () => {
    try {
      if (roomID) {
        const messagesRef = ref(
          database,
          `chatrooms/${
            route?.params?.userRoom != null ? route?.params?.userRoom : roomID
          }/messages`
        );
        onValue(messagesRef, (snapshot) => {
          const messageData = snapshot.val();
          if (messageData) {
            // Convert the message data to an array and sort it in descending order
            const messageList = Object.values(messageData)
              .filter((message) =>
                deleteMsg ? message.timestamp > deleteMsg : message
              ) // Filter messages based on last delete timestamp
              .map((message) => {
                return {
                  refID: message.refID,
                  _id: message.timestamp, // Unique identifier for each message
                  ...(message.images
                    ? { image: message.images }
                    : { text: message.text }), // Conditional assignment for message content
                  createdAt: new Date(message.timestamp),
                  user: {
                    _id: message.senderId, // Sender's user ID
                  },
                };
              })
              .reverse(); // Reverse the order to display the newest messages at the bottom
            setMessages(messageList);
          }
        });
        const snapshot = await get(messagesRef);
        console.log("this ", snapshot.exists());
        if (snapshot.exists()) {
          const lastReadRef = ref(
            database,
            `chatrooms/${roomID}/lastRead/${user?.userId}`
          );
          await set(lastReadRef, Date.now());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getBadgeNumber = async (id) => {
    try {
      const userRef = ref(database, `users/${id}/badge`);
      const snapshot = await get(userRef);
      // If the snapshot exists and contains data, return the badge number
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        // If the snapshot doesn't exist or doesn't contain data, return null or any default value
        return null; // or return any default value you prefer
      }
    } catch (error) {
      console.log(error);
      // Handle error accordingly, you can throw an error or return a default value
      throw error;
    }
  };
  const renderBubble = (props) => {
    const handleCustomLongPress = (context, message) => {
      setDeleteModal(true);
      setDeletechat(message);
    };
    return (
      <Bubble
        onLongPress={
          props.currentMessage.text != "_eidcarosse_deleted_msg_"
            ? handleCustomLongPress
            : () => null
        }
        key={props.index}
        {...props}
        wrapperStyle={{
          backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center",
          right: {
            backgroundColor: "#FAD0D0",
            marginVertical: width(1), // Change the background color for sent messages
          },
          left: {
            backgroundColor: "lightgray",
            marginVertical: width(1), // Change the background color for received messages
          },
        }}
      />
    );
  };
  const renderMessageText = (props) => {
    return (
      <MessageText
        {...props}
        key={props.index}
        currentMessage={
          props.currentMessage.text != "_eidcarosse_deleted_msg_"
            ? props.currentMessage
            : {
                _id: props.currentMessage._id,
                createdAt: props.currentMessage.createdAt,
                refID: props.currentMessage.refID,
                text: <DeleteView />,
                user: props.currentMessage.user,
              }
        }
        textStyle={{
          right: {
            color: "black",
          },
          left: {
            color: "black", // Change the text color for received messages
          },
        }}
      />
    );
  };
  const renderAvatar = (props) => {
    return (
      <View {...props}>
        <Image
          source={{ uri: receiver?.image ||"https://cdn-icons-png.flaticon.com/512/149/149071.png", }}
          style={{
            width: height(5),
            height: height(5),
            borderRadius: width(10),
          }}
        />
      </View>
    );
  };

  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeFormat="HH:mm"
        timeTextStyle={{
          right: {
            color: "black", // Change the text color for sent message times
          },
          left: {
            color: "black", // Change the text color for received message times
          },
        }}
      />
    );
  };
  // const fetchMutedRooms = async (userId) => {
  //   try {
  //     let roomRef = ref(database, `users/${userId}/mutedRoom`);

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
  // const setbadge = async (roomId, id) => {
  //   try {
  //     const userRef = ref(database, `users/${id}/badge`);
  //     const snapshot = await get(userRef);

  //     let updatedRooms;

  //     if (snapshot.exists()) {
  //       const currentRooms = snapshot.val() || [];

  //       // Check if the roomId already exists in the currentRooms array
  //       if (!currentRooms.includes(roomId)) {
  //         // If not, add it to the array
  //         updatedRooms = [...currentRooms, roomId];
  //       } else {
  //         // If it already exists, no need to update the array
  //         updatedRooms = currentRooms;
  //       }
  //     } else {
  //       // If the path doesn't exist, create it with the single roomId
  //       updatedRooms = [roomId];
  //     }
  //     await set(userRef, updatedRooms);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };
  // const getItems = useCallback(async (data) => {
  //   try {
  //     setFetchItemLoader(true);
  //     const response = await getDataofAdByID(data.split("_")[2]);
  //     setSelectedItem(response);
  //     setFetchItemLoader(false);
  //   } catch (error) {
  //     setFetchItemLoader(false);
  //   }
  // });
  // const sendNotification = async (title, message) => {
  //   try {
  //     if (route.params?.user?.userId) {
  //       // await setbadge(roomID, route?.params?.user?.userId);
  //       const postUserTokenRef = ref(
  //         database,
  //         `tokens/${route.params.usr?.userId}/userTokens`
  //       );
  //       const tokenSnapshot = await get(postUserTokenRef);
  //       let array = [];
  //       if (tokenSnapshot.exists()) {
  //         const dataUser = tokenSnapshot.val();
  //         await Object.keys(dataUser).forEach(async (refId) => {
  //           const tokenEntry = dataUser[refId];
  //           // console.log("tokenEntry", tokenEntry);
  //           if (array.includes(tokenEntry.token.data)) {
  //             console.log("Token already exists in array. Skipping.");
  //           } else {
  //             array.push(tokenEntry.token.data);
  //           }
  //         });
  //         // !mutedList.includes(route.params?.userRoom) &&
  //         //   sendPushNotification(array, title, message);
  //       } else {
  //         // Post user token not available, store notification along with postUserId

  //         await push(ref(database, `notifications/${route.params?.user?.userId}`), {
  //           title: "New Message",
  //           createdAt: serverTimestamp(),
  //         });
  //       }
  //     } else {
  //       console.log("postUserId is null or undefined. Notification not sent.");
  //     }
  //   } catch (error) {
  //     console.log("error of send notification", error);
  //   }
  // };

  // async function sendPushNotification(
  //   expoPushToken,
  //   title = "Neue Nachricht",
  //   messageText = ""
  // ) {
  //   for (const token of expoPushToken) {
  //     const message = {
  //       to: token,
  //       sound: "default",
  //       title: title,
  //       body: messageText,
  //       badge: badgeNumber.includes(roomID)
  //         ? badgeNumber.length
  //         : badgeNumber.length + 1,
  //       data: {
  //         screen: "CHAT",
  //         usr: user,
  //         userItem: route?.params.userItem,
  //         roomCreated: true,
  //         userRoom: route?.params?.userRoom
  //           ? route?.params?.userRoom
  //           : `${user?.userId}_${route.params.usr?.userId}_${route.params?.userItem._id}`,
  //       },
  //     };

  //     await fetch("https://exp.host/--/api/v2/push/send", {
  //       method: "POST",
  //       badge: 1,
  //       headers: {
  //         Accept: "application/json",
  //         "Accept-encoding": "gzip, deflate",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(message),
  //     });
  //   }
  // }
  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={{
        position: "absolute",
        right: height(7),
        ...Platform.select({
          ios: {
            bottom: height(0),
            top: height(0.1),
          },
          android: {
            bottom: height(0),
          },
        }),
        zIndex: 9999,
        width: height(4),
        height: height(4),
      }}
      onPressActionButton={() => {
        setImgModal(true);
      }}
      icon={() => (
        <Ionicons name="camera" size={height(4)} color={AppColors.primary} />
      )}
    />
  );
  const renderSend = (props) => (
    <Send
      // disabled={!selectedItem}
      {...props}
      containerStyle={{
        paddingRight: width(2),
        backgroundColor: AppColors.white,
      }}
    >
      <View
        style={{
          marginRight: width(3),
          marginBottom: height(1.2),
          paddingLeft: height(7),
          backgroundColor: AppColors.white,
        }}
      >
        <Ionicons name="send" color={AppColors.primary} size={height(3)} />
      </View>
    </Send>
  );
  const renderMessageImage = (props) => {
    if (props.currentMessage.image) {
      return (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            width: width(30),
            height: height(13),
          }}
        >
          {props?.currentMessage?.image && (
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: width(2),
                padding: width(1),
              }}
              onPress={() => {
                setImageSelect(props?.currentMessage?.image), setModal(true);
              }}
            >
              <Image
                source={{
                  uri: props?.currentMessage?.image[0],
                }}
                style={{
                  flex: 1,
                  borderRadius: width(2),
                  backgroundColor: AppColors.white,
                }}
                resizeMode="contain"
              />
              {props?.currentMessage?.image.length > 1 && (
                <View style={styles.multiImage}>
                  <Text
                    style={{
                      fontSize: height(3),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    +{props?.currentMessage?.image.length - 1}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return null;
  };
  const deleteImageMessage = async (roomID, messageID) => {
    try {
      // Step 1: Get the message data from the database
      const messageRef = ref(
        database,
        `chatrooms/${roomID}/messages/${messageID.refID}`
      );
      const messageSnapshot = await get(messageRef);
      const messageData = messageSnapshot.val();

      if (
        !messageData ||
        !messageData.images ||
        messageData.images.length === 0
      ) {
        console.log("No images found for the given message ID");
        return;
      }

      // Step 2: Delete images from storage
      const storage = getStorage();
      for (const imageUrl of messageData.images) {
        // Extract filename from URL
        const decodedUrl = decodeURIComponent(imageUrl);
        const fileName = decodedUrl.split("/").pop().split("?")[0];
        console.log(`Image name${fileName}`);
        const imageRef = storageRef(
          storage,
          `chatrooms/${roomID}/images/${fileName}`
        );

        // Delete the image from storage
        await deleteObject(imageRef);
        console.log(`Image ${fileName} deleted from storage`);
      }

      // Step 3: Delete the message from the database
      await deleteChatMessage(roomID, messageID);
      console.log(`Message ${messageID} deleted from the database`);
    } catch (error) {
      console.error("Error deleting image message:", error);
    }
  };

  const deleteChatMessage = async (chatroomId, msgId) => {
    try {
      // Fetch the original message from the database
      const msgRef = ref(
        database,
        `chatrooms/${chatroomId}/messages/${msgId.refID}`
      );
      const msgSnapshot = await get(msgRef);
      const originalMessage = msgSnapshot.val();

      // Check if the original message exists
      if (!originalMessage) {
        console.error("Original message not found");
        return;
      }

      // Save the deleted message with the same timestamp as the original message
      await set(
        ref(database, `chatrooms/${chatroomId}/messages/${msgId.refID}`),
        {
          refID: msgId.refID,
          text: "_eidcarosse_deleted_msg_",
          timestamp: originalMessage.timestamp, // Use the original message's timestamp
          senderId: user?.userId, // Set the sender's user ID here
        }
      );
    } catch (error) {
      console.error("Error deleting chatroom:", error.message);
      // Handle errors as needed
    }
  };
  const openCamera = async () => {
    try {
      if (check !== "granted") {
        Linking.openSettings();
      }
      await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.1,
      })
        .then((a) => {
          const selectedImages = a?.assets.map((imageUri) => {
            if (image?.length < 5) {
              return Platform.OS === "android"
                ? imageUri.uri
                : imageUri.uri.replace("file://", "");
            }
          });

          setImage([...image, ...selectedImages]);
          setImageModal(true);
        })
        .catch((e) => console.log("my log", e));
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const openGallery = async () => {
    setTimeout(async () => {
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 5,
        quality: 0.1,
      })
        .then((a) => {
          const selectedImages = a?.assets.map((imageUri) => {
            if (image?.length < 5) {
              return Platform.OS === "android"
                ? imageUri.uri
                : imageUri.uri.replace("file://", "");
            }
          });

          setImage([...image, ...selectedImages]);
          setImageModal(true);
        })
        .catch((e) => console.log("my log", e));
    }, 1000);
  };

  function openPicker(type = 0) {
    setImgModal(false);
    setTimeout(type == 0 ? openCamera : openGallery, 1000);
  }

  const setRooms = async (roomId, id) => {
    try {
      const dataRef = ref(database, `users/${id}/rooms`);
      lst = [`${roomId}`];
      mutedRoom = [];
      badge = [];
      await get(dataRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const roomsFromData = data;
            const newRooms = roomsFromData.filter(
              (room) => !lst.includes(room)
            );
            lst = lst.concat(newRooms);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error("Error getting data:", error);
        });

      const userRef = ref(database, `users/${id}/rooms`);
      await set(userRef, lst).catch((error) => {
        console.error("Update failed", error);
      });
    } catch (error) {
      console.log("error of setroom ", error);
    }
  };
  //Simple message acurate code
  const renderSeenStatus = (message) => {
    if (message.messages[0]?.user?.userId === user?.userId && seenmsg) {
      return (
        <Text style={styles.seenText}>
          {message.messages[0]?._id < seenmsg
            ? t("chat.seen")
            : t("chat.Delivered")}
        </Text>
      );
    }
  };
  const onSend = useCallback(async (messages = []) => {
    try {
      console.log("Sending");
      const newMessage = messages[0];

      if (user?.userId == route.params.usr?.userId) {
        //flash msg
      } else {
        if (
          (route.params?.userRoom == null ||
            route.params?.userRoom == undefined) &&
          roomID == null
        ) {
          let roomNew = `${user?.userId}_${route.params.usr?.userId}_${route.params?.userItem?._id}`;
          setRoomID(roomNew);
          const newMessageRef = push(
            ref(database, `chatrooms/${roomNew}/messages`)
          );

          await set(newMessageRef, {
            refID: newMessageRef.key,
            text: newMessage.text,
            timestamp: Date.now(),
            senderId: user?.userId, // Set the sender's user ID here
          });
          const lastReadRef = ref(
            database,
            `chatrooms/${roomNew}/lastRead/${user?.userId}`
          );
          await set(lastReadRef, Date.now());
          await setRooms(roomNew, route.params.usr?.userId, online);
          await setRooms(roomNew, user?.userId);
        } else {
          const newMessageRef = push(
            ref(database, `chatrooms/${roomID}/messages`)
          );

          set(newMessageRef, {
            refID: newMessageRef.key,
            text: newMessage.text,
            timestamp: Date.now(),
            senderId: user?.userId, // Set the sender's user ID here
          });

          // await sendNotification(user?.firstName, newMessage.text);
          await setRooms(roomID, route.params.usr?.userId);
          await setRooms(roomID, user?.userId);
          const lastReadRef = ref(
            database,
            `chatrooms/${roomID}/lastRead/${user?.userId}`
          );
          await set(lastReadRef, Date.now());
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
  async function getBlobFromFile(imageUri) {
    return (await fetch(imageUri)).blob();
  }
  const saveImages = async () => {
    try {
      setSendImageLoader(true);
      const imageUrls = [];
      if (
        (route.params?.userRoom == null ||
          route.params?.userRoom == undefined) &&
        roomID == null
      ) {
        let roomNew = `${user?.userId}_${route.params.usr?.userId}_${route.params?.userItem?._id}`;
        setRoomID(roomNew);
      }
      const storage = getStorage();
      const newMessageRef = push(ref(database, `chatrooms/${roomID}/messages`));

      for (const imageUri of image) {
        const split = imageUri.split("/");
        const name = split.pop();
        const imageRef = storageRef(
          storage,
          `chatrooms/${roomID}/images/${name}`
        );

        const metadata = {
          contentType: "image/jpeg",
        };

        // // Get the blob from the image URI
        try {
          const imageBlob = await getBlobFromFile(imageUri);

          const uploadTask = await uploadBytes(
            imageRef,
            imageBlob,
            metadata
          ).catch((err) => {
            console.log("Error uploading images:", err);
          });
          const snapshot = await uploadTask;

          if (snapshot) {
            const downloadUrl = await getDownloadURL(imageRef);
            if (downloadUrl) {
              imageUrls.push(downloadUrl);
            }
          }
        } catch (error) {
          console.log("Error uploading images:", error);
          setSendImageLoader(false);
        }
      }

      if (imageUrls.length > 0) {
        await setRooms(roomID, route.params.usr?.userId);
        await setRooms(roomID, user?.userId);
        await set(newMessageRef, {
          refID: newMessageRef.key,
          images: imageUrls,
          timestamp: Date.now(),
          senderId: user?.userId,
        });
      }
      // await sendNotification(user?.firstName, "Bild");
      setImageModal(false);
      const lastReadRef = ref(
        database,
        `chatrooms/${roomID}/lastRead/${user?.userId}`
      );
      await set(lastReadRef, Date.now());
      setSendImageLoader(false);
      setImage([]);
    } catch (error) {
      console.log("muktipule iamge", error);
    }
  };
  const handleBack = () => {
    navigation.goBack();
  };

  const closeModal = () => {
    setImageModal(false);
    setImage([]);
  };
  const renderDay = (props) => <Day {...props} dateFormat={"DD/MM/ YYYY"} />;
  //////////////////////////////////////////////////////////////////////////////
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.account_View}>
          <TouchableOpacity style={styles.icon_Style} onPress={handleBack}>
            <MaterialIcons
              name="arrow-back-ios"
              size={height(3)}
              color={AppColors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              () => {}
              // route.params?.usr &&
              // navigation.navigate(ScreenNames.OTHERPROFILE, {
              //   user: route.params?.usr,
              // })
              // {"address": "Tellemo office", "email": "Telenor", "phoneNumber": "+923002918546", "userId": "JPYBfVCXFMRSAwMSgGUtKmGnKIB3", "username": "Telenor"}
            }
          >
            <Image
              source={{
                uri:
                  route.params?.usr?.image ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.image_Style}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.account_Text}>
              {route?.params?.usr?.username}
            </Text>
            {online ? (
              <View style={styles.online_View}>
                <View style={styles.online_Indicator}></View>
                <Text style={styles.online_Text}>Online</Text>
              </View>
            ) : (
              <View style={styles.online_View}>
                <View
                  style={{ ...styles.online_Indicator, backgroundColor: "red" }}
                ></View>
                <Text style={styles.online_Text}>Offline</Text>
              </View>
            )}
          </View>
        </View>
        {/* {selectedItem && (
          <View>
            <AdView detail={selectedItem} />
          </View>
        )} */}
        <View
          style={{
            backgroundColor: AppColors.greybackground,
            alignSelf: "center",
            paddingHorizontal: height(2),
            paddingVertical: height(0.5),
            marginTop: height(1),
            marginHorizontal: width(5),
            borderRadius: height(3),
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Ionicons name="timer" color={"grey"} size={height(1.2)} />
          <Text
            style={{
              fontSize: height(1.3),
              textAlign: "center",
              color: "grey",
              fontWeight: "bold",
              paddingHorizontal: width(0.1),
            }}
          >
            {t("chat.disapermsg")}
          </Text>
        </View>
        {(stater || fetchItemLoader) && <ActivityIndicator size="large" />}
        <GiftedChat
          onSend={onSend}
          scrollToBottom={true}
          renderSend={renderSend}
          onPressActionButton={(a) => console.log(a)}
          messages={messages.map((message) => ({
            ...message,
            _id: message._id.toString(), // Ensure that _id is a string
          }))}
          placeholder={t("chat.placeholder")}
          placeholderTextColor={"grey"}
          user={{
            _id: user?.userId,
          }}
          renderAvatar={renderAvatar}
          renderDay={renderDay}
          renderActions={renderActions}
          renderMessageImage={renderMessageImage}
          renderMessageText={renderMessageText}
          renderTime={renderTime}
          renderBubble={renderBubble}
          renderFooter={renderSeenStatus}
          textInputProps={{
            editable: route.params?.usr ? true : false,
            color: "black",
            backgroundColor: AppColors.white,
          }}
          containerStyle={{ backgroundColor: AppColors.white }}
        />

        <Modal
          visible={imageModal}
          backdropOpacity={1}
          animationIn="fadeInUpBig"
          animationInTiming={500}
          backdropColor={AppColors.jetBlack}
          onBackButtonPress={closeModal}
        >
          <View style={styles.modalContainer}>
            <SwiperFlatList
              ref={imageSendRef}
              showPagination
              data={image}
              paginationStyle={{ paddingBottom: height(15) }}
              renderItem={({ item }) => (
                <View
                  style={{
                    height: height(70),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: width(100),
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      disabled={sendImageLoader}
                      // onPress={closeModal}
                      onPress={() => {
                        let f = image.filter((i) => {
                          if (i != item) return i;
                        });

                        if (f.length < 1) {
                          closeModal();
                        } else {
                          setImage(f);
                          imageSendRef?.current?.goToFirstIndex();
                        }
                      }}
                      style={{
                        margin: width(5),
                        alignItems: "flex-end",
                      }}
                    >
                      <MaterialIcons
                        name="delete"
                        size={height(3.5)}
                        color={"white"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={sendImageLoader}
                      onPress={closeModal}
                      style={{
                        margin: width(5),
                        alignItems: "flex-end",
                      }}
                    >
                      <MaterialIcons
                        name="close"
                        size={height(4)}
                        color={"white"}
                      />
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{ uri: item }}
                    resizeMode="contain"
                    style={{
                      width: width(100),
                      height: height(65),
                      marginTop: height(1),
                      // alignSelf: "center",
                    }}
                    // style={{ flex: 1, resizeMode: "cover" }}
                  />
                </View>
              )}
            />
            {/* <Button
              isLoading={sendImageLoader}
              containerStyle={{ marginTop: height(3) }}
              title={"chat.send"}
              onPress={saveImages}
            /> */}
          </View>
        </Modal>

        <DropDownMenu
          isVisible={imgModal}
          firstBtnText={t("addPost.takephoto")}
          secondBtnText={t("addPost.choosefromgallery")}
          onPressFirstBtn={() => {
            openPicker(0);
          }}
          onPressSecondBtn={() => {
            openPicker(1);
          }}
          onClose={() => setImgModal(false)}
        />
      </View>
      <DropDownMenu
        isVisible={deleteModal}
        secondBtnText={
          deletechat?.user?.userId == user?.userId && t("chat.remove")
        }
        firstBtnText={t("chat.copy")}
        onClose={() => {
          setDeleteModal(false), setDeletechat("");
        }}
        onPressSecondBtn={() => {
          setDeleteModal(false);
          if (deletechat?.user?.userId == user?.userId) {
            if (deletechat.image) deleteImageMessage(roomID, deletechat);
            else deleteChatMessage(roomID, deletechat);
          } else {
          }
        }}
        onPressFirstBtn={() => {
          setDeleteModal(false);
          deletechat?.text && Clipboard.setString(deletechat.text);
        }}
      />
      <Modal
        isVisible={modal}
        animationIn="fadeInUpBig"
        statusBarTranslucent={false}
        animationInTiming={500}
        animationOutTiming={10}
        backdropColor={AppColors.jetBlack}
        backdropOpacity={1}
        onBackButtonPress={closeImageModal}
        onSwipeComplete={closeImageModal}
        swipeDirection="down"
        animationOut={"fadeOut"}
      >
        <View style={styles.imageModalView}>
          <TouchableOpacity
            onPress={closeImageModal}
            style={styles.imageCloseIcon}
          >
            <MaterialIcons name="close" size={height(4)} color={"white"} />
          </TouchableOpacity>
          {imageSelect.length && (
            <View style={styles.selectedImageStyle}>
              <ImageViewer
                useNativeDriver={true}
                enablePreload={true}
                enableImageZoom={true}
                imageUrls={imageSelect?.map((image) => ({ url: image }))}
                enableSwipeDown={true}
                renderIndicator={() => null}
                onSwipeDown={closeImageModal}
                loadingRender={() => (
                  <ActivityIndicator color={AppColors.primary} />
                )}
                saveToLocalByLongPress={false}
                swipeDownThreshold={50}
                renderFooter={(a) => (
                  <View
                    style={{
                      alignSelf: "center",
                      justifyContent: "center",
                      width: width(100),
                      marginTop: height(10),
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: AppColors.greybackground,
                        alignSelf: "center",
                        justifyContent: "center",
                        width: width(30),
                        borderRadius: height(3),
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "center",
                          justifyContent: "center",
                          padding: height(1),
                          fontSize: height(1.7),
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {a + 1 + " / " + imageSelect.length}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
import { StyleSheet } from "react-native";

const getStyles = (AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: height(1),
    },
    account_View: {
      width: width(90),
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      marginBottom: height(2),
    },
    icon_Style: {
      width: width(8),
      flexDirection: "row",
      alignItems: "center",
    },
    image_Style: {
      width: height(7),
      height: height(7),
      borderRadius: height(10),
      borderWidth: height(0.5),
      borderColor: AppColors.greybackground,
    },
    account_Text: {
      marginLeft: width(5),
      fontSize: 20,
      fontWeight: "600",
      color: AppColors.black,
    },
    online_View: {
      marginLeft: width(5),
      flexDirection: "row",
      alignItems: "center",
    },
    online_Text: {
      fontSize: 12,
      paddingLeft: 5,
      color: AppColors.black,
    },
    online_Indicator: {
      width: 7,
      height: 7,
      borderRadius: 10,
      backgroundColor: "green",
    },
    item_View: {
      width: width(95),
      marginLeft: width(2),
      backgroundColor: AppColors.white,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: AppColors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    ad_Btn: {
      width: width(20),
      height: height(4),
      backgroundColor: "#13E890",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 30,
    },
    title_Text: {
      fontSize: 18,
      fontWeight: "600",
    },
    price_Text: {
      fontSize: 14,
      fontWeight: "700",
      color: "#13E890",
    },

    modalContainer: {
      alignSelf: "center",
      height: height(100),
      width: width(100),
      paddingVertical: height(7),
      backgroundColor: AppColors.jetBlack,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
    seenText: {
      alignSelf: "flex-end",
      paddingHorizontal: width(3),
      paddingBottom: height(1),
      color: AppColors.grey,
      fontSize: height(1.5),
      fontWeight: "400",
    },
    imageModalView: {
      alignSelf: "center",
    },
    imageCloseIcon: {
      width: width(12),
      alignItems: "flex-start",
      alignSelf: "flex-end",
      marginRight: width(3),
      padding: width(2),
    },
    imageModalSwipper: {
      height: height(70),
      alignSelf: "center",
    },
    selectedImageStyle: {
      width: width(98),
      height: height(85),
      alignSelf: "center",
    },
    multiImage: {
      width: width(28),
      height: height(12),
      backgroundColor: "rgba(0,0,0,.1)",
      position: "absolute",
      top: height(0.5),
      padding: height(1),
      alignSelf: "center",
      borderRadius: height(0.7),
      justifyContent: "center",
      alignItems: "center",
    },
  });
export default getStyles;

export default ChatView;
