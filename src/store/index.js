import { configureStore, combineReducers } from "@reduxjs/toolkit";
import citysSlice from "./slices/citysSlice";
import userSlice from "./slices/userSlice";
import modalsSlice from "./slices/modalsSlice";
import questionsSlice from "./slices/questionsSlice";

const rootReducer = combineReducers({
  user: userSlice,
  citys: citysSlice,
  questions: questionsSlice,
  modals: modalsSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

window.store = store;
export default store;
