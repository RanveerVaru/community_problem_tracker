// issueSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  issues: [],
  searchResults: [], // Add a new state for search results
};

const issueSlice = createSlice({
  name: "issue",
  initialState,
  reducers: {
    getAllIssues: (state, action) => {
      state.issues = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload; // Update search results
    },
    clearSearchResults: (state) => {
      state.searchResults = []; // Clear search results
    },
  },
});

export const { getAllIssues, setSearchResults, clearSearchResults } = issueSlice.actions;
export default issueSlice.reducer;