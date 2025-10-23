import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    isLogin: false,
    account: null as any,
  },
  reducers: {
    loginHandler: (state, action) =>{
      state.isLogin = true;
      state.account = action.payload;
    },
    logoutHandler: (state) => {
      state.isLogin = false;
      state.account = null;
    },
    
  },
});

export const { loginHandler, logoutHandler } = accountSlice.actions;

export default accountSlice.reducer;
