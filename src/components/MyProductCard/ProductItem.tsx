import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import Modal from "react-native-modal";
import { Feather } from "@expo/vector-icons";
import SwiperFlatList from "react-native-swiper-flatlist";

import { IProduct } from "../../utills/types";
import QuantityContainer from "./QuantityContainer";
import { Color } from "../../utills/GlobalStyles";
import { height, width } from "../../utills/Dimension";
import Icons, { IconsImage } from "../../assets/images";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ProductItemProps {
  item: IProduct;
  navigation: any;
}

const MyProductCard: React.FC<ProductItemProps> = ({ item, onPress }) => {
  const [isShow, setIsShow] = useState(false);
  const closeModel = () => setIsShow(false);
  return (
    <>
      <TouchableOpacity style={styles.item} onPress={() => setIsShow(true)}>
        <Image source={Icons.p1} style={styles.imaage} />
        <Text
          style={[styles.itemText, { fontSize: height(2), fontWeight: "bold" }]}
        >
          {item.name}
        </Text>
        <Text style={styles.itemText}>{item.description}</Text>
        <Text style={styles.itemText}>Price: {item.unitPrice}</Text>
        <Text style={styles.itemText}>
          Total Quantity: {item.totalQuantity}
        </Text>
      </TouchableOpacity>
      <Modal
        isVisible={isShow}
        // swipeDirection={"down"}
        onBackdropPress={closeModel}
        onBackButtonPress={closeModel}
        // onSwipeComplete={closeModel}
      >
        <View style={styles.item1}>
          {/* <Image source={Icons.p1} style={styles.imaage1} />
           */}
          <View
            style={{
              alignSelf: "center",
              height: height(40),
              width: width(88),
              paddingVertical: height(7),
              backgroundColor: "black",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              borderRadius: height(3),
            }}
          >
            <SwiperFlatList
              showPagination
              data={IconsImage}
              paginationStyleItemInactive={{
                width: height(1),
                height: height(1),
              }}
              paginationStyle={{
                paddingBottom: height(0),
                alignItems: "center",
              }}
              renderItem={({ item }) => {
                console.log(item);

                return (
                  <Image
                    source={item}
                    resizeMode="contain"
                    style={{
                      width: width(88),
                      height: "100%",
                      // marginTop: height(1),
                      // alignSelf: "center",
                    }}
                    // style={{ flex: 1, resizeMode: "cover" }}
                  />
                );
              }}
            />
          </View>
          <View style={{ marginVertical: height(3) }}>
            <Text
              style={[
                styles.itemText,
                { fontSize: height(2), fontWeight: "bold" },
              ]}
            >
              {item.name}
            </Text>
            <Text style={styles.itemText}>{item.description}</Text>
            <Text style={styles.itemText}>Price: {item.unitPrice}</Text>
            <Text style={styles.itemText}>
              Total Quantity: {item.totalQuantity}
            </Text>
            <TouchableOpacity
              style={styles.quantityContainer1}
              onPress={onPress}
            >
              <Feather
                name="edit"
                color={Color.primaryColor}
                size={height(2.5)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    width: width(30),
    margin: height(0.3),
    padding: height(0.3),
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: height(1.5),
    backgroundColor: Color.white,
  },
  item1: {
    width: width(90),
    margin: height(0.3),
    padding: height(0.3),
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: height(3),
    backgroundColor: Color.white,
  },
  itemText: {
    fontSize: height(1.8),
    color: Color.colorDarkslateblue,
    marginBottom: 1,
    marginLeft: width(2),
  },
  quantityContainer: {
    position: "absolute",
    right: height(1),
    top: height(10),
  },
  quantityContainer1: {
    position: "absolute",
    right: height(2),
    bottom: height(2),
  },
  imaage: {
    height: height(15),
    width: "100%",
    borderRadius: height(2),
    marginBottom: height(2),
  },
  imaage1: {
    height: height(40),
    width: "100%",
    borderRadius: height(2),
    marginBottom: height(2),
  },
  button: {
    backgroundColor: Color.primaryColor,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyProductCard;
