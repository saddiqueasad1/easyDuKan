import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IdTokenResult, User, UserMetadata } from "firebase/auth";

const initialState: User = {
  emailVerified: false,
  isAnonymous: false,
  metadata: {} as UserMetadata,
  providerData: [],
  refreshToken: "",
  tenantId: null,
  delete: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  getIdToken: function (forceRefresh?: boolean): Promise<string> {
    throw new Error("Function not implemented.");
  },
  getIdTokenResult: function (forceRefresh?: boolean): Promise<IdTokenResult> {
    throw new Error("Function not implemented.");
  },
  reload: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  toJSON: function (): object {
    throw new Error("Function not implemented.");
  },
  displayName: null,
  email: null,
  phoneNumber: null,
  photoURL: null,
  providerId: "",
  uid: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
