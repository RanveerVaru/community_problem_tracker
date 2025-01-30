import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores logged-in user
  isAuthenticated: false,
  isAdmin : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    admin : (state) => {
      state.isAdmin = true;
    }
  },
});

export const { login, admin ,logout } = authSlice.actions;
export default authSlice.reducer;
