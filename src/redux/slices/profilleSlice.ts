import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProfile } from "../../utills/types";

const initialState = {
  username: "",
  phoneNumber: "",
  email: "",
  address: "",
  userId: "",
  emailVerified: false,
  photoURL: "",
  branchIds: [] as string[],
  branchName: "",
};

const profileSilse = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<IProfile>) {
      state.username = action.payload.username;
      state.phoneNumber = action.payload.phoneNumber;
      state.email = action.payload.email;
      state.address = action.payload.address;
      state.userId = action.payload.userId || "";
      state.emailVerified = action.payload.emailVerified || false;
      state.photoURL = action.payload.photoURL || "";
      state.branchName = action.payload.branchName || "";
      state.branchIds = action.payload.branchIds || [];
    },
    clearProfile: () => initialState,
  },
});

export const { setProfile, clearProfile } = profileSilse.actions;

export default profileSilse.reducer;
