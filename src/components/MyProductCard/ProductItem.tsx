import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import Modal from "react-native-modal";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import SwiperFlatList from "react-native-swiper-flatlist";

import { IProduct } from "../../utills/types";
import QuantityContainer from "./QuantityContainer";
import { Color } from "../../utills/GlobalStyles";
import { height, urlImage, width } from "../../utills/Dimension";
import Icons, { IconsImage } from "../../assets/images";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ProductItemProps {
  item: IProduct;
  navigation: any;
}

const MyProductCard: React.FC<ProductItemProps> = ({
  item,
  onPress,
  onPressDelete,
}) => {
  const [isShow, setIsShow] = useState(false);
  const closeModel = () => setIsShow(false);

  return (
    <>
      <TouchableOpacity style={styles.item} onPress={() => setIsShow(true)}>
        <Image
          source={{
            uri: item?.productImages?.length>0
              ? item?.productImages[0]
              : urlImage,
          }}
          style={styles.imaage}
        />
        <View style={{ padding: height(1) }}>
          <Text style={[{ fontSize: height(2), fontWeight: "bold" }]}>
            {item.name}
          </Text>
          <Text style={{ color: "green" }}>Price: {item.unitPrice}</Text>
        </View>
      </TouchableOpacity>
      <Modal
       animationIn='bounceIn'
       animationOut={'bounceOut'}
       animationOutTiming={800}
       animationInTiming={1000}
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
              data={item?.productImages}
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
                    source={{ uri: item }}
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
          <View
            style={{
              marginVertical: height(3),
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={[
                  styles.itemText,
                  { fontSize: height(2), fontWeight: "bold" },
                ]}
              >
                {item.name}
              </Text>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.price}>Price: {item.unitPrice}</Text>
              <Text style={styles.quantity}>
                Total Quantity: {item.totalQuantity}
              </Text>
            </View>
            <View>
              <TouchableOpacity style={styles.iconButton} onPress={onPress}>
                <Feather
                  name="edit"
                  color={Color.primaryColor}
                  size={height(2.5)}
                />
                <Text style={styles.iconBtnTex}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onPressDelete}
              >
                <MaterialIcons name="delete" color={"red"} size={height(3)} />
                <Text style={[styles.iconBtnTex, { color: "red" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
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
  price: {
    fontSize: height(1.8),
    marginBottom: 1,
    marginLeft: width(2),
    color: Color.primaryColor,
    fontWeight: "500",
  },
  quantity: {
    fontSize: height(1.8),
    color: Color.colorDarkslateblue,
    marginBottom: 1,
    marginLeft: width(2),
    fontWeight: "500",
  },
  iconButton: {
    paddingHorizontal: height(2),
    paddingVertical: height(0.5),
    margin: height(0.5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnTex: {
    fontSize: height(1.6),
    color: Color.primaryColor,
  },
});

export default MyProductCard;
