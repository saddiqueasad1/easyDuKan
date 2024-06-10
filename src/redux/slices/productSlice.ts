import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IProduct } from "../../utills/types";

const initialState: IProduct[] = [];

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<IProduct[]>) {
      return action.payload;
    },
    addProduct(state, action: PayloadAction<IProduct>) {
      state.push(action.payload);
    },
 
    updateProduct(state, action: PayloadAction<IProduct>) {
      const index = state.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setProduct, addProduct, updateProduct } =
  productSlice.actions;

export const selectProductById = (
  state: RootState,
  id: string
): IProduct | undefined => state.products.find((product) => product.id === id);

export default productSlice.reducer;
