import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { deleteObject, getStorage, ref as storageRef } from "@firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { get, getDatabase, onValue, ref, set, off } from "firebase/database";
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Dialog from "react-native-dialog";
import { Menu, MenuItem } from "react-native-material-menu";
import { useDispatch, useSelector } from "react-redux";
// import { setNewChat } from "../../redux/slices/config";
// import { selectCurrentLanguage } from "../../redux/slices/language";
// import { selectUserMeta } from "../../redux/slices/user";
// import ScreenNames from "../../routes/routes";
import { Color as AppColors } from "../utills/GlobalStyles";
import { height, width } from "../utills/Dimension";

// import { ThemeContext } from "../../theme";
import GlobalMethods from "../utills/GlobalMethods";
import { RootState } from "../redux/store";

export const DeleteView = () => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        paddingTop: height(0.5),
      }}
    >
      <MaterialCommunityIcons name={"cancel"} color={AppColors.grey} />
      <Text
        style={{
          color: AppColors.grey,
          fontStyle: "italic",
          fontSize: height(1.5),
        }}
      >
        {t("chat.deletemsg")}
      </Text>
    </View>
  );
};

export default function ChatIcon({ data, disable, mute }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const database = getDatabase();
  const user = useSelector((state: RootState) => state.profile);
  // const language = useSelector(selectCurrentLanguage);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visibleModel, setVisibleModel] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(false);
  const [newMsg, setNewMsg] = useState();
  const [userDetail, setUserDetail] = useState();
  const [latestMsg, setLatestMsg] = useState();
  const [showlatestMsg, setShowLatestMsg] = useState({ text: "...." });
  const [online, setOnline] = useState(false);
  // const { AppColors } = useContext(ThemeContext);
  const styles = getStyles(AppColors);
  useEffect(() => {
    if (data) {
      const userStatusRef = ref(database, `users/${data?.user?.userId}/online`);
      onValue(userStatusRef, (snapshot) => {
        const status = snapshot.val();
        setOnline(status);
      });
    }
  });
  useEffect(() => {
    // setSelectedItem(!data?.product || !data?.user);
    setUserDetail(data);
  }, [data]);
  const hideMenu = () => setVisibleModel(false);
  useEffect(() => {
    if (
      showlatestMsg?.timestamp != latestMsg?.timestamp ||
      showlatestMsg?.text != latestMsg?.text
    ) {
      setShowLatestMsg(latestMsg);
    }
  }, [latestMsg]);
  useEffect(() => {
    if (data?.roomId == userDetail?.roomId) {
      const dataRef = ref(database, `chatrooms/${userDetail?.roomId}/messages`);
      onValue(dataRef, handleSnapshot);
      return () => {
        off(dataRef, handleSnapshot); // Unsubscribe from the database reference
      };
    }
  }, [userDetail, data]);
  //////
  // const deleteImageMessage = async (roomID, messageData) => {
  //   try {
  //     const storage = getStorage();
  //     for (const imageUrl of messageData.images) {
  //       // Extract filename from URL
  //       const decodedUrl = decodeURIComponent(imageUrl);
  //       const fileName = decodedUrl.split("/").pop().split("?")[0];
  //       console.log(`Image name${fileName}`);
  //       const imageRef = storageRef(
  //         storage,
  //         `chatrooms/${roomID}/images/${fileName}`
  //       );

  //       // Delete the image from storage
  //       await deleteObject(imageRef);
  //       console.log(`Image ${fileName} deleted from storage`);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting image message:", error);
  //   }
  // };
  // async function checkChat(chat = []) {
  //   chat.map(async (i) => {
  //     const firebaseDate = new Date(i?.timestamp);

  //     // Calculate difference in milliseconds
  //     const differenceIcnMs = new Date() - firebaseDate;

  //     // Calculate difference in days
  //     const differenceInDays = differenceIcnMs / (1000 * 60 * 60 * 24);
  //     if (differenceInDays > 15 && i?.refID) {
  //       if (i?.images) {
  //         await deleteImageMessage(data?.roomId, i);
  //         await remove(
  //           ref(database, `chatrooms/${data?.roomId}/messages/${i?.refID}`)
  //         );
  //       } else {
  //         await remove(
  //           ref(database, `chatrooms/${data?.roomId}/messages/${i?.refID}`)
  //         );
  //         console.log("Message deleted successfully", i);
  //       }
  //     }
  //   });
  // }
  const deleteChatroom = async (chatroomId) => {
    try {
      const lastReadRef = ref(
        database,
        `chatrooms/${chatroomId}/lastDelete/${user.userId}`
      );
      await set(lastReadRef, Date.now());
      await setRooms(chatroomId, user?.userId);
      await setBadge(chatroomId, user?.userId);
    } catch (error) {
      console.error("Error deleting chatroom:", error.message);
      // Handle errors as needed
    }
  };
  const setRooms = async (roomId, id) => {
    try {
      const userRef = ref(database, `users/${id}/rooms`);
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
  const setBadge = async (roomId, id) => {
    try {
      const userRef = ref(database, `users/${id}/badge`);
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

  const handlePress = () => {
    if (data) {
      setNewMsg(false);
      navigation.navigate("ChatScreen", {
        usr: data?.user,
        userRoom:data.roomId
      });
    }
  };
  const setMutedRoom = async (roomId, id, mute) => {
    try {
      const userRef = ref(database, `users/${id}/mutedRoom`);
      const snapshot = await get(userRef);

      let updatedRooms;

      if (snapshot.exists()) {
        const currentRooms = snapshot.val() || [];

        if (mute) {
          updatedRooms = [...currentRooms, roomId];
          // Add the room to be muted
        } else {
          updatedRooms = currentRooms?.filter((room) => room !== roomId);
          // Remove the room from muted rooms
        }
      } else {
        updatedRooms = [roomId];
        // If the path doesn't exist, create it with the single roomId
      }

      // Update the user's data with the updated rooms array
      await set(userRef, updatedRooms);
    } catch (error) {
      // Handle errors
    }
  };

  const handleSnapshot = useCallback(async (snapshot) => {
    let lastmsg = {};
    const lastReadRef = ref(
      database,
      `chatrooms/${userDetail?.roomId}/lastRead/${user?.userId}`
    );
    const snapsho = await get(lastReadRef);
    let lastReadTimestamp = await snapsho.val();
    const messageData = snapshot.val();
    if (messageData) {
      const messageList = Object.values(messageData);
      // await checkChat(messageList);
      lastmsg = messageList[messageList.length - 1];
    }
    setLatestMsg(lastmsg);
    setNewMsg(
      lastReadTimestamp < lastmsg?.timestamp && lastmsg.senderId != user?.userId
    );
    if (lastReadTimestamp < lastmsg?.timestamp) {
      // console.log(data?.roomId, userDetail?.roomId);
      if (data?.roomId == userDetail?.roomId) {
      }
      // dispatch(setNewChat(lastReadTimestamp < lastmsg?.timestamp));
    }
    // Handle the updated data here
  });

  return (
    <Fragment>
      <View style={{ alignItems: "flex-end" }}>
        <Menu
          visible={visibleModel}
          onRequestClose={hideMenu}
          style={{
            backgroundColor: AppColors.white,
            shadowColor: AppColors.black,
            shadowOpacity: 0.5,
          }}
        >
          <MenuItem
            onPress={() => {
              setVisibleModel(false);
              setTimeout(() => {
                setVisible(true);
              }, 600);
            }}
          >
            <Text style={{ color: AppColors.primary, fontSize: height(1.5) }}>
              {t("Delete")}
            </Text>
          </MenuItem>
          {/* <MenuItem
            onPress={() => {
              setVisibleModel(false);
              setMutedRoom(data?.roomId, user.userId, !mute);
            }}
          >
            <Text style={{ fontSize: height(1.5), color: AppColors.black }}>
              {mute ? t("Mutex") : t("chat.mute")}
            </Text>
          </MenuItem> */}
        </Menu>
      </View>
      <TouchableOpacity
        disabled={disable}
        style={[
          styles.main,
          visibleModel && {
            backgroundColor: "#D1FFBD",
            paddingHorizontal: width(2),
            borderRadius: height(1),
          },
        ]}
        onLongPress={() => {
          setVisibleModel(true);
        }}
        onPress={handlePress}
      >
        <View
          style={[
            styles.imageview,
            selectedItem && { borderColor: "lightgrey" },
          ]}
        >
          <Image
            resizeMode="cover"
            style={[styles.image]}
            source={{
              uri:
                userDetail?.user?.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />

          {imageLoading && (
            <View
              style={{
                width: height(8),
                height: height(8),
                borderRadius: height(10),
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color={AppColors.primary} />
            </View>
          )}
          {selectedItem && (
            <View
              style={{
                width: height(8),
                height: height(8),
                borderRadius: height(10),
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                position: "absolute",
              }}
            />
          )}
          {online && (
            <View
              style={{
                height: height(1.7),
                width: height(1.7),
                backgroundColor: "green",
                borderRadius: height(5),
                position: "absolute",
                left: width(11.5),
                top: height(6),
                borderWidth: 1,
                borderColor: AppColors.white,
              }}
            />
          )}
        </View>
        <View style={styles.detail}>
          <Text
            numberOfLines={1}
            style={[
              {
                fontWeight: "400",
                fontSize: height(1.8),
                paddingTop: height(1),
                color: AppColors.black,
              },
              newMsg && {
                fontWeight: "bold",
              },
              selectedItem && { color: AppColors.deleteChat },
            ]}
          >
            {userDetail?.user?.userId ? `${userDetail?.user?.username}` : "New User"}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              {
                fontWeight: "600",
                fontSize: height(1.2),
                paddingTop: height(0.3),
                color: AppColors.black,
                width: width(40),
              },
              newMsg && {
                fontWeight: "bold",
                fontSize: height(1.3),
                color: AppColors.bgIcon,
              },
              selectedItem && { color: AppColors.deleteChat },
            ]}
          >
            {userDetail?.user?.phoneNumber
              ? `${userDetail?.user?.phoneNumber}`
              : t("chat.deleted")}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              {
                paddingTop: height(0.5),
                fontSize: height(1.5),
                color: AppColors.black,
                fontWeight: "300",
              },
              newMsg && { fontWeight: "bold", fontSize: height(1.3) },
              selectedItem && { color: AppColors.deleteChat },
            ]}
          >
            {showlatestMsg?.text ? (
              showlatestMsg?.text == "_eidcarosse_deleted_msg_" ? (
                <DeleteView />
              ) : (
                showlatestMsg?.text
              )
            ) : (
              showlatestMsg?.images && (
                <Ionicons
                  name="image"
                  size={height(2)}
                  color={newMsg ? AppColors.black : AppColors.grey}
                />
              )
            )}
          </Text>
          <Text />
        </View>
        <View style={styles.icons}>
          <Text
            numberOfLines={1}
            style={[
              {
                fontWeight: "300",
                fontSize: height(1.2),
                color: AppColors.black,
                width: width(30),
                textAlign: "right",
                marginVertical: height(0.5),
              },
              newMsg && {
                fontWeight: "bold",
                color: AppColors.black,
              },
              selectedItem && { color: AppColors.deleteChat },
            ]}
          >
            {showlatestMsg?.timestamp &&
              //showlatestMsg?.timestamp
              //   ? `${new Date(showlatestMsg?.timestamp).getDate()}/${
              //       new Date(showlatestMsg?.timestamp).getMonth() + 1
              //     }/${new Date(showlatestMsg?.timestamp).getFullYear()}`
              //   :
              GlobalMethods.calculateTimeDifference(
                showlatestMsg?.timestamp,
                "en"
              )}
          </Text>
          {showlatestMsg?.timestamp != latestMsg?.timestamp ||
            showlatestMsg?.text != latestMsg?.text ||
            (newMsg && (
              <View
                style={{
                  backgroundColor: AppColors.primary,
                  height: height(1.5),
                  width: height(1.5),
                  borderRadius: height(1),
                  marginVertical: height(0.5),
                }}
              />
            ))}
          {mute && (
            <Ionicons
              name="volume-mute"
              size={height(2)}
              color={AppColors.grey}
            />
          )}
        </View>
      </TouchableOpacity>
      <View>
        <Dialog.Container
          visible={visible}
          contentStyle={{ backgroundColor: AppColors.white }}
        >
          <Dialog.Title style={{ fontSize: height(2), color: "red" }}>
            {" "}
            {t("chat.delete")}
          </Dialog.Title>
          <Dialog.Description>
            <Text style={{ fontSize: height(1.5), color: AppColors.black }}>
              {t("chat.deleteChatIconMsg")}
            </Text>
          </Dialog.Description>
          <Dialog.Button
            label={t("myad.cancel")}
            onPress={() => {
              setVisible(false);
            }}
          />
          <Dialog.Button
            color={"red"}
            label={t("myad.delete")}
            onPress={() => {
              deleteChatroom(data?.roomId);
              setVisible(false);
            }}
          />
        </Dialog.Container>
      </View>
    </Fragment>
  );
}
import { StyleSheet } from "react-native";

const getStyles = (AppColors) =>
  StyleSheet.create({
    main: {
      flexDirection: "row",
      width: width(96),
      alignItems: "center",
      justifyContent: "space-between",
      alignContent: "center",
    },
    imageview: {
      width: height(10),
    },
    image: {
      width: height(8),
      height: height(8),
      borderRadius: width(10),
      borderWidth: height(0.4),
      borderColor: AppColors.greybackground,
    },
    detail: {
      alignItems: "flex-start",
      width: width(50),
    },
    icons: {
      alignItems: "flex-end",
      paddingVertical: height(1),
      marginHorizontal: width(1),
      width: width(20),
    },
  });
export { getStyles };
