import { configureStore } from "@reduxjs/toolkit";

import UserReducer from "../slices/UserSlice";
import QuizReducer from "../slices/QuizSlice";
import RedeemReducer from"../slices/RedeemSlice"
import subscriptionReducer from"../slices/SubcriptionSlice"
const store = configureStore({
  reducer: {
    users: UserReducer,
    quizes: QuizReducer,
    redeem:RedeemReducer,
    subscription:subscriptionReducer
  },
});

console.log("store initial state:", store.getState());

export default store;
