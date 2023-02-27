import { createSlice } from "@reduxjs/toolkit";

export interface ICommonState {
  loginPopup: boolean;
  userInfo: any;
}

const initialState: ICommonState = {
  loginPopup: false,
  userInfo: null,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setLoginPopup: (state, action) => {
      state.loginPopup = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setLoginPopup, setUserInfo } = commonSlice.actions;

export default commonSlice;
