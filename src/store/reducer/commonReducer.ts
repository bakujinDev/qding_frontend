import { createSlice } from "@reduxjs/toolkit";

export interface ICommonState {
  emailAuthPopup: boolean;
  loginPopup: boolean;
  userInfo: any;
}

const initialState: ICommonState = {
  emailAuthPopup: false,
  loginPopup: false,
  userInfo: null,
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
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setEmailAuthPopup, setLoginPopup, setUserInfo } =
  commonSlice.actions;

export default commonSlice;
