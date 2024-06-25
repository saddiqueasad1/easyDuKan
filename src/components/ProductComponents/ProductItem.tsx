import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { IProduct } from "../../utills/types";
import QuantityContainer from "./QuantityContainer";
import { Color } from "../../utills/GlobalStyles";
import { height, urlImage, width } from "../../utills/Dimension";
import Icons from "../../assets/images";

interface ProductItemProps {
  item: IProduct;
  navigation: any;
  handleIncreaseQuantity: (
    id: string,
    currentQuantity: number,
    item: IProduct
  ) => void;
  handleDecreaseQuantity: (
    id: string,
    currentQuantity: number,
    item: IProduct
  ) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  item,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}) => {
  return (
    <View style={styles.item}>
      <Image
        source={{
          uri:
            item?.productImages?.length > 0 ? item?.productImages[0] : urlImage,
        }}
        style={styles.imaage}
      />

      <View style={{ width: width(35) }}>
        <Text
          style={[
            styles.itemText,
            {
              fontSize: height(2),
              fontWeight: "bold",
              color: Color.colorDarkslateblue,
            },
          ]}
        >
          {item.name}
        </Text>
        {/* <Text style={styles.itemText}>{item?.category}</Text> */}
        <Text style={styles.itemText}>
          Price:
          <Text style={{ color: "green", fontWeight: "bold" }}>
            {" "}
            {item.unitPrice}
          </Text>
        </Text>
        <Text style={styles.itemText}>
          Total Quantity:{" "}
          <Text style={{ color: "red", fontWeight: "bold" }}>
            {" "}
            {item.totalQuantity}
          </Text>
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <QuantityContainer
          item={item}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: width(97),
    margin: height(0.3),
    padding: height(0.3),
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: height(1.5),
    backgroundColor: Color.white,
    flexDirection: "row",
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
    top: height(2),
  },
  imaage: {
    height: height(8),
    width: height(8),
    borderRadius: height(1),
  },
});

export default ProductItem;
