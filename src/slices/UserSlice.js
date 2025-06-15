import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../Config/axios";

export const fetchuserAccount = createAsyncThunk(
  "users/fetchuserAccount",
  async (_undefined, { rejectWithValue }) => {
    try {
      const response = await axios.get("/profile", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        errors: err.response?.data?.errors || "Failed to fetch user",
      });
    }
  }
)


export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async ({formData, resetForm }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/update-profile/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      });
      resetForm();
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || error.message
      );
    }
  }
)
export const fetchusers = createAsyncThunk(
  "users/fetchusers",
  async (_, { rejectWithValue }) => {
    try {
     
      const response = await axios.get("/users", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



export const updateUserActivation = createAsyncThunk(
  "user/updateUserActivation",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/activateUser/${id}`,
        { isActive },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        errors: err.response?.data?.errors || "Failed to update activation",
      });
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get("/users", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        return response.data;
      } catch (err) {
        console.error(err);
        return rejectWithValue("Something went wrong");
      }
    }
  );
const UserSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
             
    data: null,           
    isLoggedIn: false,
    isLoading: false,
    error: null,
    serverErrors: null,
    editId: null,

  },
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.data = null;
      state.isLoggedIn = false;
      state.error = null;
      state.serverErrors = null;
    },
     updateProfile: (state, action) => {
      state.editId = action.payload; 
    },
  },
  extraReducers: (builder) => {
  
    builder
      .addCase(fetchuserAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.serverErrors = null;
      })
      .addCase(fetchuserAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchuserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.serverErrors = action.payload;
        state.data = null;
        state.isLoggedIn = false;
      })

.addCase(updateUserProfile.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(updateUserProfile.fulfilled, (state, action) => {
  state.data = action.payload;  
  state.isLoading = false;
})
.addCase(updateUserProfile.rejected, (state, action) => {
  state.isLoading = false;
  state.serverErrors = action.payload;
})


      .addCase(updateUserActivation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserActivation.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserActivation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
.addCase(fetchusers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchusers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users =  action.payload ;
    })
    .addCase(fetchusers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    })
 .addCase(fetchAllUsers.fulfilled, (state, action) => {
          state.users = action.payload;
        })
        .addCase(fetchAllUsers.rejected, (state, action) => {
          state.serverErrors = action.payload;
        })
  },
 });

export const { login, logout ,updateProfile} = UserSlice.actions;
export default UserSlice.reducer;
