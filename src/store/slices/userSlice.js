import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { $api } from "../../api/api";

export const asyncSignup = createAsyncThunk("asyncSignup", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.post("/users/signup", data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncLogin = createAsyncThunk("asyncLogin", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.post("/users/login", data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncConnect = createAsyncThunk("asyncConnect", async (token, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const localStorageToken = localStorage.getItem("token");
    const res = await $api.get(`/users/connect`, {
      headers: {
        Authorization: `Bearer ${token || localStorageToken}`,
      },
    });
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncGetInfoUser = createAsyncThunk("asyncGetInfoUser", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.get(`/users/info/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncGetUsers = createAsyncThunk("asyncGetUsers", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.get(`/users/get`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncUpdateUser = createAsyncThunk("asyncUpdateUser", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.patch(`/users/update/${data.userId}`, data.data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncDeleteUser = createAsyncThunk("asyncDeleteUser", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.delete(`/users/delete/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const initialState = {
  isAuth: false,
  user: null,
  users: [],
  count: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, { payload }) => {
      state.user = payload;
      state.isAuth = true;
    },
    signout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      state.isAuth = false;
      state.user = null;
    },
  },
  extraReducers: {
    [asyncLogin.fulfilled]: (_, { payload }) => {
      localStorage.setItem("token", payload.token);
      localStorage.setItem("refresh", payload.refresh);

      // eslint-disable-next-line no-restricted-globals
      location.reload();
    },
    [asyncLogin.rejected]: (_, { payload }) => {
      toast.error(`Не удалось авторизоваться ${payload?.response?.data?.message || ""}`);
    },

    [asyncSignup.fulfilled]: () => {
      toast.success("Вы успешно зарегистрированы");
    },
    [asyncSignup.rejected]: (_, { payload }) => {
      toast.error(`Не удалось зарегистрироваться ${payload?.response?.data?.message || ""}`);
    },

    [asyncGetInfoUser.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить данные пользователя ${payload?.response?.data?.message || ""}`);
    },

    [asyncConnect.fulfilled]: (state, { payload }) => {
      state.isAuth = true;
      state.user = payload;
    },
    [asyncConnect.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить данные аккаунта ${payload?.response?.data?.message || ""}`);
    },

    [asyncGetUsers.fulfilled]: (state, { payload }) => {
      state.users = payload.user;
      state.count = payload.count;
    },
    [asyncGetUsers.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить пользователей ${payload?.response?.data?.message || ""}`);
    },

    [asyncUpdateUser.fulfilled]: (_, { payload }) => {
      toast.success("Пользователь успешно изменен");
    },
    [asyncUpdateUser.rejected]: (_, { payload }) => {
      toast.error(`Не удалось изменить пользователя ${payload?.response?.data?.message || ""}`);
    },

    [asyncDeleteUser.fulfilled]: (_, { payload }) => {
      toast.success("Пользователь успешно удален");
    },
    [asyncDeleteUser.rejected]: (_, { payload }) => {
      console.log(payload);
      toast.error(`Не удалось удалить пользователя ${payload?.response?.data?.message || ""}`);
    },
  },
});

export const { signout, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
