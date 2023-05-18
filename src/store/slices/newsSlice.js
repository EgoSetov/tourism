import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { $api } from "../../api/api";

export const asyncGetNews = createAsyncThunk("asyncGetNews", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    let url = `/news/get/${data.page}`;
    if (data.creator) {
      url += `/?creator=${data.creator}`;
    }
    const res = await $api.get(url);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncCreateNews = createAsyncThunk("asyncCreateNews", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.post(`/news/create/`, data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncUpdateNews = createAsyncThunk("asyncUpdateNews", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.patch(`/news/update/${data.newsId}`, data.data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncLikeNews = createAsyncThunk("asyncLikeNews", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.patch(`/news/like/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncDeleteNews = createAsyncThunk("asyncDeleteNews", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.delete(`/news/delete/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncGetCommentsNews = createAsyncThunk("asyncGetCommentsNews", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.get(`/news/comments/get/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncCreateCommentNews = createAsyncThunk("asyncCreateCommentNews", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.post(`/news/comments/create/${data.newsId}`, data.data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncDeleteCommentNews = createAsyncThunk("asyncDeleteCommentNews", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.delete(`/news/comments/delete/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const initialState = {
  news: [],
  count: 0,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: {
    [asyncGetNews.fulfilled]: (state, { payload }) => {
      state.news = payload.news;
      state.count = payload.count;
    },
    [asyncGetNews.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить посты ${payload?.response?.data?.message || ""}`);
    },

    [asyncCreateNews.fulfilled]: (_, { payload }) => {
      toast.success("Пост успешно создан");
    },
    [asyncCreateNews.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить посты ${payload?.response?.data?.message || ""}`);
    },

    [asyncUpdateNews.fulfilled]: (_, { payload }) => {
      toast.success("Пост успешно изменен");
    },
    [asyncUpdateNews.rejected]: (_, { payload }) => {
      toast.error(`Не удалось изменить пост ${payload?.response?.data?.message || ""}`);
    },

    [asyncDeleteNews.fulfilled]: (_, { payload }) => {
      toast.success("Пост успешно удален");
    },
    [asyncDeleteNews.rejected]: (_, { payload }) => {
      toast.error(`Не удалось удалить пост ${payload?.response?.data?.message || ""}`);
    },

    [asyncLikeNews.rejected]: (_, { payload }) => {
      toast.error(`Не удалось поставить лайк ${payload?.response?.data?.message || ""}`);
    },

    [asyncGetCommentsNews.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить комментарии поста ${payload?.response?.data?.message || ""}`);
    },

    [asyncCreateCommentNews.rejected]: (_, { payload }) => {
      toast.error(`Не удалось оставить комментарий к посту ${payload?.response?.data?.message || ""}`);
    },

    [asyncDeleteCommentNews.rejected]: (_, { payload }) => {
      toast.success("Комментарий успешно удален");
    },
    [asyncDeleteCommentNews.rejected]: (_, { payload }) => {
      toast.error(`Не удалось удалить комментарий ${payload?.response?.data?.message || ""}`);
    },
  },
});

export const {} = newsSlice.actions;

export default newsSlice.reducer;
