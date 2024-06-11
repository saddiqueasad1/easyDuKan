import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProfile } from "../../utills/types";

const profileSilse = createSlice({
  name: "profile",
  initialState: {
    username: "",
    phoneNumber: "",
    email: "",
    address: "",
    userId: "",
    emailVerified: false,
    photoURL: "",
    branchIds: [],
    selectedBranchId: "",
    branchName: "",
  },
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
      state.selectedBranchId = action.payload.selectedBranchId || "";
      state.branchIds = action.payload.branchIds || [];
    },
  },
});

export const { setProfile } = profileSilse.actions;

export default profileSilse.reducer;
