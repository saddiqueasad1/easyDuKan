import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { IProduct } from "../../utills/types";
import QuantityContainer from "./QuantityContainer";
import { Color } from "../../utills/GlobalStyles";
import { height, width } from "../../utills/Dimension";
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
      <Image source={Icons.p1} style={styles.imaage} />
      <Text
        style={[styles.itemText, { fontSize: height(2), fontWeight: "bold" }]}
      >
        {item.name}
      </Text>
      <Text style={styles.itemText}>{item.description}</Text>
      <Text style={styles.itemText}>Price: {item.unitPrice}</Text>
      {/* <Text style={styles.itemText}>Total Quantity: {item.totalQuantity}</Text> */}
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
    width: width(48),
    margin: height(.3),
    padding: height(.3),
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: height(1.5),
    backgroundColor: Color.white,
  },
  itemText: {
    fontSize: height(1.8),
    color: Color.colorDarkslateblue,
    marginBottom: 1,
    marginLeft:width(2)
  },
  quantityContainer: {
    position: "absolute",
    right: height(1),
    top: height(10),
  },
  imaage: {
    height: height(15),
    width: "100%",
    borderRadius: height(2),
    marginBottom: height(2),
  },
});

export default ProductItem;
