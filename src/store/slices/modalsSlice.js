import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createCity: { visible: false, data: null },
  editCity: { visible: false, data: null },

  createHotel: { visible: false, data: null },
  editHotel: { visible: false, data: null },

  createNews: { visible: false, data: null },
  editNews: { visible: false, data: null },

  createQuestion: { visible: false, data: null },
  editQuestion: { visible: false, data: null },

  comments: { visible: false, data: null },

  signin: { visible: false, data: null },
  signup: { visible: false, data: null },
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    showModal: (state, { payload }) => {
      if (state[payload.modal] !== undefined) {
        state[payload.modal] = {
          visible: payload.visible,
          data: payload?.data,
        };
      }
    },
  },
});

export const { showModal } = modalsSlice.actions;

export default modalsSlice.reducer;
