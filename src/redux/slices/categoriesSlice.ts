import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../utills/types";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setCategories, setLoading, deleteCategory } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
