import { createSlice } from "@reduxjs/toolkit";

export interface ICommonState {
  emailAuthPopup: boolean;
}

const initialState: ICommonState = {
  emailAuthPopup: false,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setEmailAuthPopup: (state, action) => {
      state.emailAuthPopup = action.payload;
    },
  },
});

export const { setEmailAuthPopup } = commonSlice.actions;

export default commonSlice;
