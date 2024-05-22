import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface Category {
  id: string;
  name: string;
}

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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setCategories, setLoading } = categoriesSlice.actions;

export default categoriesSlice.reducer;
