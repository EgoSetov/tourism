import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { $api } from "../../api/api";

export const asyncGetQuestions = createAsyncThunk("asyncGetQuestions", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.get(`/questions/get`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncCreateQuestion = createAsyncThunk("asyncCreateQuestion", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.post(`/questions/create`, data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncUpdateQuestion = createAsyncThunk("asyncUpdateQuestion", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.patch(`/questions/update/${data.questionId}`, data.data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncDeleteQuestion = createAsyncThunk("asyncDeleteQuestion", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.delete(`/questions/delete/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const initialState = {
  questions: [],
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  extraReducers: {
    [asyncGetQuestions.fulfilled]: (state, { payload }) => {
      state.questions = payload;
    },
    [asyncGetQuestions.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить вопросы ${payload?.response?.data?.message || ""}`);
    },

    [asyncCreateQuestion.fulfilled]: (_) => {
      toast.success("Вопрос успешно создан");
    },
    [asyncCreateQuestion.rejected]: (_, { payload }) => {
      toast.error(`Не удалось создать вопрос ${payload?.response?.data?.message || ""}`);
    },

    [asyncUpdateQuestion.fulfilled]: (_) => {
      toast.success("Вопрос успешно изменен");
    },
    [asyncUpdateQuestion.rejected]: (_, { payload }) => {
      toast.error(`Не удалось изменить вопрсо ${payload?.response?.data?.message || ""}`);
    },

    [asyncDeleteQuestion.fulfilled]: (_) => {
      toast.success("Вопрос успешно удален");
    },
    [asyncDeleteQuestion.rejected]: (_, { payload }) => {
      toast.error(`Не удалось удалить вопрос ${payload?.response?.data?.message || ""}`);
    },
  },
});

export const {} = questionsSlice.actions;

export default questionsSlice.reducer;
