import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { IProduct } from "../../utills/types";
import QuantityContainer from "./QuantityContainer";
import { Color } from "../../utills/GlobalStyles";

interface ProductItemProps {
  item: IProduct;
  navigation: any;
  handleIncreaseQuantity: (
    id: string,
    currentQuantity: number,
    item: IProduct,
  ) => void;
  handleDecreaseQuantity: (
    id: string,
    currentQuantity: number,
    item: IProduct,
  ) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  item,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}) => {
  return (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Description: {item.description}</Text>
      <Text style={styles.itemText}>Unit Price: {item.unitPrice}</Text>
      {/* <Text style={styles.itemText}>Total Quantity: {item.totalQuantity}</Text> */}
      <View style={styles.quantityContainer}>
        <QuantityContainer
          item={item}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    backgroundColor: Color.colorWhite,
  },
  itemText: {
    fontSize: 16,
    color: Color.colorDarkslateblue,
    marginBottom: 5,
  },
  quantityContainer: {
    position: "absolute",
    right: 5,
    top: 0,
  },
});

export default ProductItem;
