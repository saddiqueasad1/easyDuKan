import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
 appLoader:false
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setAppLoader: (state, action) => {
      state.appLoader = action.payload;
    },
  },
});
export const loaderSliceReducer = loaderSlice.reducer;
export const {
  setAppLoader
} = loaderSlice.actions;
export const selectAppLoader = (state: RootState) => state.loader.appLoader;
