import React from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const ChatScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>chat screen</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
