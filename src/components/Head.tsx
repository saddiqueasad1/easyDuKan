import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { height, width } from "../utills/Dimension";
import { Color } from "../utills/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Category {
  id: string;
  name: string;
}

const Header: React.FC = ({
  searchText,
  setSearchText,
  selectValue,
  SetSelectValue,
  categories,
  showTopHead = true,
}) => {
  const categoryListRef = useRef<FlatList<Category>>(null);
  const navigation = useNavigation();
  const profile = useSelector((state: RootState) => state.profile);
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    // Implement your search logic here, filtering categories if needed
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor:
            item.id == selectValue ? Color.primaryColor : "#f0f0f0",
        },
      ]}
      onPress={() => SetSelectValue(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          {
            color: item.id == selectValue ? "white" : "black",
          },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.header}>
      {showTopHead && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: height(1),
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: height(1),
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Image
              source={{
                uri:
                  profile?.photoURL ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.ProfileIcon}
            />
            <Text
              style={{
                fontSize: height(3),
                fontWeight: "bold",
                color: Color.primaryColor,
                fontStyle: "italic",
                width: width(63),
                paddingHorizontal: height(2),
              }}
            >
              eassyDukan
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignContent: "center",
              width: width(20),
            }}
          >
            <TouchableOpacity
              style={{ padding: height(0.5) }}
              // onPress={() => navigation.navigate("chatListScreen")}
            >
              <Ionicons
                name={"notifications-sharp"}
                color={"grey"}
                size={height(2.5)}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: height(0.5) }}
              onPress={() => navigation.navigate("chatListScreen")}
            >
              <Ionicons name="chatbubble" color={"grey"} size={height(2.5)} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={{ flexDirection: "row" }}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={searchText}
            onChangeText={handleSearchChange}
            placeholderTextColor="#ccc"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}
            >
              {/* <Text style={styles.clearButtonText}>X</Text> */}
              <Entypo
                name={"circle-with-cross"}
                color={Color.primaryColor}
                size={height(2.5)}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {categories && (
        <FlatList
          ref={categoryListRef}
          data={categories}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: height(5),
    paddingHorizontal: height(1),
    width: width(95),
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  clearButton: {
    marginLeft: 5,
    padding: height(1),
  },
  clearButtonText: {
    fontSize: 16,
    color: "black",
  },
  categoryItem: {
    marginVertical: height(1),
    paddingHorizontal: height(3),
    paddingVertical: height(1),
    marginHorizontal: height(0.2),
    backgroundColor: "#eee",
    borderRadius: height(3),
  },
  categoryText: {
    fontSize: 14,
  },
  ProfileIcon: {
    height: height(5),
    width: height(5),
    borderRadius: height(5),
    borderWidth: height(0.3),
    borderColor: Color.primaryColor,
  },
});

export default Header;
