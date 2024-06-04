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
import Icons from "../assets/images";
import { useNavigation } from "@react-navigation/native";

interface Category {
  id: string;
  name: string;
}

const Header: React.FC = ({
  searchText,
  setSearchText,
  selectValue,
  SetSelectValue,
}) => {
  const categoryListRef = useRef<FlatList<Category>>(null);
  const navigation = useNavigation();

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    // Implement your search logic here, filtering categories if needed
  };

  const handleClearSearch = () => {
    setSearchText("");
  };
  console.log(selectValue);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor:
            item.id == selectValue ? Color.secondaryColor : "white",
        },
      ]}
      onPress={() => SetSelectValue(item.id)}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const categories: Category[] = [
    { id: "0", name: "All" },
    { id: "1", name: "Clothes" },
    { id: "2", name: "Shoes" },
    { id: "3", name: "Kind" },
    { id: "4", name: "Clothes" },
    { id: "5", name: "Shoes" },
    { id: "6", name: "Kind" },
    { id: "17", name: "Clothes" },
    { id: "27", name: "Shoes" },
    { id: "38", name: "Kind" },

    // Add more categories as needed
  ];

  return (
    <View style={styles.header}>
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
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={{ paddingHorizontal: height(1) }}
          onPress={() => navigation.openDrawer()}
        >
          {/* <Text style={styles.clearButtonText}>X</Text> */}
          <Image source={Icons.p2} style={styles.ProfileIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={categoryListRef}
        data={categories}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: height(1),
    width: width(80),
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
    margin: height(1),
    paddingHorizontal: height(3),
    paddingVertical: height(1),
    marginRight: height(0.5),
    backgroundColor: "#eee",
    borderRadius: height(1),
  },
  categoryText: {
    fontSize: 14,
  },
  ProfileIcon: {
    height: height(5),
    width: height(5),
    borderRadius: height(5),
    borderWidth: height(0.3),
    borderColor: Color.secondaryColor,
  },
});

export default Header;
