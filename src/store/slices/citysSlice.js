import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { $api } from "../../api/api";

export const asyncGetCitys = createAsyncThunk("asyncGetCitys", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.get(`/citys/get`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncGetRecommendationCitys = createAsyncThunk("asyncGetRecommendationCitys", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.get(`/citys/get/?recommendation=true`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncCreateCity = createAsyncThunk("asyncCreateCity", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.post(`/citys/create/`, data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncUpdateCity = createAsyncThunk("asyncUpdateCity", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.patch(`/citys/update/${data.cityId}`, data.data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncLikeCity = createAsyncThunk("asyncLikeCity", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.patch(`/citys/like/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncDeleteCity = createAsyncThunk("asyncDeleteCity", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.delete(`/citys/delete/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncGetCommentsCity = createAsyncThunk("asyncGetCommentsCity", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.get(`/citys/comments/get/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncCreateCommentCity = createAsyncThunk("asyncCreateCommentCity", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.post(`/citys/comments/create/${data.cityId}`, data.data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncDeleteCommentCity = createAsyncThunk("asyncDeleteCommentCity", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.delete(`/citys/comments/delete/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// * hotels
export const asyncGetHotels = createAsyncThunk("asyncGetHotels", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.get(`/hotels/get/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncCreateHotel = createAsyncThunk("asyncCreateHotel", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.post(`/hotels/create/${data.cityId}`, data.data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncUpdateHotel = createAsyncThunk("asyncUpdateHotel", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.patch(`/hotels/update/${data.hotelId}`, data.data);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const asyncDeleteHotel = createAsyncThunk("asyncDeleteHotel", async (data, helpers) => {
  const { rejectWithValue } = helpers;
  try {
    const res = await $api.delete(`/hotels/delete/${data}`);
    if (res.data) return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const initialState = {
  citys: [],
  recommendationCitys: [],
};

const citysSlice = createSlice({
  name: "citys",
  initialState,
  reducers: {},
  extraReducers: {
    [asyncGetCitys.fulfilled]: (state, { payload }) => {
      state.citys = payload.citys;
    },
    [asyncGetCitys.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить регионы ${payload?.response?.data?.message || ""}`);
    },

    [asyncGetRecommendationCitys.fulfilled]: (state, { payload }) => {
      state.recommendationCitys = payload.citys;
    },
    [asyncGetRecommendationCitys.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить регионы ${payload?.response?.data?.message || ""}`);
    },

    [asyncCreateCity.fulfilled]: (_, { payload }) => {
      toast.success("Регион успешно создан");
    },
    [asyncCreateCity.rejected]: (_, { payload }) => {
      toast.error(`Не удалось создать регион ${payload?.response?.data?.message || ""}`);
    },

    [asyncUpdateCity.fulfilled]: (_, { payload }) => {
      toast.success("Регион успешно изменен");
    },
    [asyncUpdateCity.rejected]: (_, { payload }) => {
      toast.error(`Не удалось изменить регион ${payload?.response?.data?.message || ""}`);
    },

    [asyncDeleteCity.fulfilled]: (_, { payload }) => {
      toast.success("Регион успешно удален");
    },
    [asyncDeleteCity.rejected]: (_, { payload }) => {
      toast.error(`Не удалось удалить регион ${payload?.response?.data?.message || ""}`);
    },

    [asyncLikeCity.rejected]: (_, { payload }) => {
      toast.error(`Не удалось поставить лайк ${payload?.response?.data?.message || ""}`);
    },

    [asyncGetCommentsCity.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить комментарии региона ${payload?.response?.data?.message || ""}`);
    },

    [asyncCreateCommentCity.rejected]: (_, { payload }) => {
      toast.error(`Не удалось оставить комментарий к региону ${payload?.response?.data?.message || ""}`);
    },

    [asyncDeleteCommentCity.rejected]: (_, { payload }) => {
      toast.success("Комментарий успешно удален");
    },
    [asyncDeleteCommentCity.rejected]: (_, { payload }) => {
      toast.error(`Не удалось удалить комментарий ${payload?.response?.data?.message || ""}`);
    },

    // * hotels
    [asyncGetHotels.rejected]: (_, { payload }) => {
      toast.error(`Не удалось получить отели ${payload?.response?.data?.message || ""}`);
    },

    [asyncCreateHotel.fulfilled]: (_, { payload }) => {
      toast.success("Отель успешно создан");
    },
    [asyncCreateHotel.rejected]: (_, { payload }) => {
      toast.error(`Не удалось создать отель ${payload?.response?.data?.message || ""}`);
    },

    [asyncUpdateHotel.fulfilled]: (_, { payload }) => {
      toast.success("Отель успешно изменен");
    },
    [asyncUpdateHotel.rejected]: (_, { payload }) => {
      toast.error(`Не удалось изменить отель ${payload?.response?.data?.message || ""}`);
    },

    [asyncDeleteHotel.fulfilled]: (_, { payload }) => {
      toast.success("Отель успешно удален");
    },
    [asyncDeleteHotel.rejected]: (_, { payload }) => {
      toast.error(`Не удалось удалить отель ${payload?.response?.data?.message || ""}`);
    },
  },
});

export const {} = citysSlice.actions;

export default citysSlice.reducer;
