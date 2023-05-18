import { configureStore, combineReducers } from "@reduxjs/toolkit";
import citysSlice from "./slices/citysSlice";
import userSlice from "./slices/userSlice";
import modalsSlice from "./slices/modalsSlice";
import questionsSlice from "./slices/questionsSlice";
import newsSlice from "./slices/newsSlice";

const rootReducer = combineReducers({
  user: userSlice,
  citys: citysSlice,
  questions: questionsSlice,
  news: newsSlice,
  modals: modalsSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
