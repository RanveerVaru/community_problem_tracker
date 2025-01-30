import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import rootReducer from "./rootReducer"; // Import combined reducers
import { combineReducers } from "redux";

// Persist Config
const persistConfig = {
  key: "root",
  storage, // Saves data in localStorage
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

const persistor = persistStore(store); // Persistor for rehydrating state

export { store, persistor };
