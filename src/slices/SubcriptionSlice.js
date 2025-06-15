import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";

export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/subscriptions", subscriptionData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create subscription"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "subscription/verifyPayment",
  async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/verify-payment",
        { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify payment"
      );
    }
  }
);

export const listSubscriptions = createAsyncThunk(
  "subscription/listSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const response = await axios.get("/subscriptions", config);
      return response.data.subscriptions;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch subscriptions"
      );
    }
  }
);

const SubcriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptions: [],
    loading: false,
    error: null,
    createdSubscription: null,
    quiz_limit: 0,
    success: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCreatedSubscription(state) {
      state.createdSubscription = null;
    },
    resetSubscriptionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createdSubscription = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.createdSubscription = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create subscription";
      })
      .addCase(listSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;

        const activeSub = action.payload.find(
          (sub) => sub.status === "active" && new Date(sub.subscription_end) >= new Date()
        );

        state.quiz_limit = activeSub?.quiz_limit || 0;
      })
      .addCase(listSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch subscriptions";
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSubscriptionState, clearCreatedSubscription } = SubcriptionSlice.actions;

export default SubcriptionSlice.reducer;
