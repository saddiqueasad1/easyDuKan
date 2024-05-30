import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  chatRooms: [],
  chats: [],
  newChat: false,
  networkLoder: true,
  colorTheme: "light",
  deviceToken: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatRooms: (state, action) => {
      state.chatRooms = action.payload;
    },
    setChatRedux: (state, action) => {
      state.chats = action.payload;
    },
    setNewChat: (state, action) => {
      state.newChat = action.payload;
    },
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
    },
    setDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
    },
  },
});
export const chatSliceReducer = chatSlice.reducer;
export const {
  setDeviceToken,
  setColorTheme,
  setNewChat,
  setChatRooms,
  setChatRedux,
} = chatSlice.actions;
export const selectNewChat = (state: RootState) => state.chat.newChat;
export const selectNetworkLoder = (state: RootState) => state.chat.networkLoder;
export const selectColorTheme = (state: RootState) => state.chat.colorTheme;
export const selectDeviceToken = (state: RootState) => state.chat.deviceToken;
export const selectChatRooms = (state: RootState) => state.chat.chatRooms;
export const selectChatRedux = (state: RootState) => state.chat.chats;
