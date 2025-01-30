import { combineReducers } from "redux";
import authReducer from "./slices/authSlice"; // Import your reducers
import issueReducer from "./slices/issueSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  issue: issueReducer, 
});

export default rootReducer;
