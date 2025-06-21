import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../Config/axios";

export const fetchQuizes = createAsyncThunk(
  "quizes/fetchQuizes",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/quiz", {
        params: { page, limit },
         headers: {
          Authorization: localStorage.getItem("token"),
        },
        
      });
      return response.data;
      // console.log("the qises",response.data) 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch quizes"
      );
    }
  }
);
export const fetchQuizById = createAsyncThunk(
  "quizes/fetchQuizById",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/quiz/${quizId}`);
      

      console.log("ans",response.data);
      return response.data

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch quiz"
      );
    }
  }
);

export const createQuiz = createAsyncThunk(
  "quizes/createQuiz",
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/quiz", quizData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        errors: err.response?.data?.errors || "Failed to create quiz",
      });
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quizes/updateQuiz",
  async ({ id, quizData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/quiz/${id}`, quizData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        errors: err.response?.data?.errors || "Failed to update quiz",
      });
    }
  }
);
export const deleteQuiz = createAsyncThunk(
  "quizes/deleteQuiz",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/quiz/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return { id };
    } catch (err) {
      return rejectWithValue({
        message: err.message,
        errors: err.response?.data?.errors || "Failed to delete quiz",
      });
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quizes/submitQuiz",
  async ({ id, answers }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/quiz/submit/${id}`,
        { answers },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Submission failed");
    }
  }
);
export const addTotalPoints = createAsyncThunk(
  "quizes/addTotalPoints",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/quiz/${quizId}/totalpoints`);
      return response.data.quiz; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
export const addQuizAttempt = createAsyncThunk(
  "quizes/addQuizAttempt",
  async ({ quizId, score, answers, attemptedAt }, { rejectWithValue }) => {
    try {
     
      const res = await axios.post(`/quiz/attempts`, {
        quizId,score, answers, attemptedAt
      }, {
        headers: {
              'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token"),
        },
      });
      return res.data;
      
    } catch (err) {
      console.log(err)
      return rejectWithValue(err.response?.data?.error|| err.message);
    }
  }
);
export const addUserQuizHistory = createAsyncThunk(
  "quiz/addUserQuizHistory",
  async (_, { rejectWithValue }) => {
    try {
     
      const res = await axios.post(`/quiz/history`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);
export const fetchQuizHistory = createAsyncThunk(
  "quizes/fetchQuizHistory",
  async (_, { rejectWithValue }) => {
    try {
    
      const response = await axios.get("/quiz-history", {
        headers: {
           Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch quiz history"
      );
    }
  }
);

const quizSlice = createSlice({
      name: "quizes",
      initialState: {
      quizes: [], 
      quizHistory: [],             
      totalPoints: 0,       
      isLoading: false,
      error: null,
      serverErrors: null,
      currentIndex: 0,      
      currentQuiz: null,    
      score: null,  
      attemptedAt: null,
      page: 1,
      limit: 10,
      totalPages: 0,
      userPoints: 0,
      loadingAttempts: false,
      attemptsError: null,
      quizResult: null,    
      quiz:null    
  },
  reducers: {
    previous(state) {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    next(state) {
      if (state.currentIndex < state.quizes.length - 1) {
        state.currentIndex += 1;
      }
    },
    resetIndex(state) {
      state.currentIndex = 0;
    },
    setCurrentIndex(state, action) {
      const index = action.payload;
      if (index >= 0 && index < state.quizes.length) {
        state.currentIndex = index;
      }
    },
    clearScore(state) {
      state.score = null;
  state.results = null;
    },
    clearCurrentQuiz(state) {
      state.currentQuiz = null;
    },
  
  nextPage(state) {
    if (state.page < state.totalPages) {
      state.page += 1;
    }
  },
  prevPage(state) {
    if (state.page > 1) {
      state.page -= 1;
    }
  },
  setPage(state, action) {
    const newPage = action.payload;
    if (newPage >= 1 && newPage <= state.totalPages) {
      state.page = newPage;
    }
  },
},
  extraReducers: (builder) => {
    builder
     .addCase(createQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.serverErrors = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizes.push(action.payload);
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.serverErrors = action.payload;
      })

    
      .addCase(updateQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.serverErrors = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.quizes.findIndex(
          (quiz) => quiz._id === action.payload._id
        );
        if (idx !== -1) state.quizes[idx] = action.payload;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.serverErrors = action.payload;
      })
      .addCase(deleteQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.serverErrors = [];
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizes = state.quizes.filter(
          (quiz) => quiz._id !== action.payload.id
        );
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.serverErrors = action.payload;
      })

    .addCase(fetchQuizes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizes.fulfilled, (state, action) => {
        state.isLoading = false;
       state.quizes = action.payload.quizzes;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalQuizzes = action.payload.totalQuizzes;
      })
      .addCase(fetchQuizes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      })

      
      .addCase(fetchQuizById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentQuiz = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

 
.addCase(submitQuiz.pending, (state) => {
    state.isLoading = true;
    state.error = null;
    state.quizResult = null;
  })
  .addCase(submitQuiz.fulfilled, (state, action) => {
    state.isLoading = false;
    state.quizResult = action.payload; 
    state.score = action.payload.score;
  })
  .addCase(submitQuiz.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  })


  .addCase(addQuizAttempt.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(addQuizAttempt.fulfilled, (state) => {
    state.isLoading = false;
  })
  .addCase(addQuizAttempt.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  })

  builder
  .addCase(addUserQuizHistory.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(addUserQuizHistory.fulfilled, (state, action) => {
    state.isLoading = false;
    state.quizHistory = action.payload;
  })
  .addCase(addUserQuizHistory.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  })


  .addCase(fetchQuizHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("wuizhistoty",action.payload)
        state.quizHistory = action.payload;
      })
      .addCase(fetchQuizHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addTotalPoints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTotalPoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quiz = action.payload; 
      })
      .addCase(addTotalPoints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
})
  
export const {
  previous,
  next,
  clearScore,
  clearCurrentQuiz,
  resetIndex,
  setCurrentIndex,
   nextPage, prevPage,
   setPage
} = quizSlice.actions;

export default quizSlice.reducer;
