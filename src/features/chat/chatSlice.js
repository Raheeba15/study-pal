// src/features/chat/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedReceiverId: null,
    unreadCount: 0,
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedReceiverId = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
});

export const { setSelectedChat, setUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
