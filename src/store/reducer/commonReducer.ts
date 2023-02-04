import { createSlice } from "@reduxjs/toolkit";

export interface ICommonState {
  emailAuthPopup: boolean;
  loginPopup: boolean;
}

const initialState: ICommonState = {
  emailAuthPopup: false,
  loginPopup: false,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setEmailAuthPopup: (state, action) => {
      state.emailAuthPopup = action.payload;
    },
    setLoginPopup: (state, action) => {
      state.loginPopup = action.payload;
    },
  },
});

export const { setEmailAuthPopup, setLoginPopup } = commonSlice.actions;

export default commonSlice;
