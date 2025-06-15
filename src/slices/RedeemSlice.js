import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../Config/axios";




export const createRedemption = createAsyncThunk(
  'redeem/createRedemption',
  async ({quizId,score}, { rejectWithValue }) => {
    try {
      const response = await axios.post("/redemptions/create", 
 { quizId,score },{
        
        headers: {
             'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);


export const listRedemptions = createAsyncThunk(
  'redeem/listRedemptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/list`,{
        headers: {
           
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data.redemptions;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
export const redeemCode = createAsyncThunk(
  'redeem/redeem',
  async (redemption_code, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/redeem`, { redemption_code },{
         headers: {
             'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token"),
        },
      });
    

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);


export const checkExpiredRedemptions = createAsyncThunk(
  'redeem/checkExpired',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/check-expired`);
      return response.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const RedeemSlice = createSlice({
  name: 'redeem',
  initialState: {
    redemptions: [],
    loading: false,
    error: null,
    successMessage: null,
    redeemed: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
      state.redeemed = null;
    }
  },
  extraReducers: (builder) => {
    
    builder.addCase(createRedemption.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(createRedemption.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
      state.redemptions=action.payload.redemption;
    });
    builder.addCase(createRedemption.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(listRedemptions.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(listRedemptions.fulfilled, (state, action) => {
  state.loading = false;
  state.redemptions = action.payload;  
  console.log("Redemptions set in state:", action.payload);
})

   
    builder.addCase(listRedemptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  
    builder.addCase(redeemCode.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.redeemed = null;
      state.successMessage = null;
    });
    builder.addCase(redeemCode.fulfilled, (state, action) => {
      state.loading = false;
      state.redeemed = action.payload.redemption;
      state.successMessage = action.payload.message;

      const idx = state.redemptions.findIndex(r => r._id === action.payload.redemption._id);
      if (idx !== -1) {
        state.redemptions[idx] = action.payload.redemption;
      }
    });
    builder.addCase(redeemCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.redeemed = null;
    });

    builder.addCase(checkExpiredRedemptions.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(checkExpiredRedemptions.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload;
    });
    builder.addCase(checkExpiredRedemptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { clearMessages } =RedeemSlice.actions;
export default RedeemSlice.reducer;
