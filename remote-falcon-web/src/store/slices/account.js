import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  isDemo: false,
  coreInfo: null
};

const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    startLoginAction(state, action) {
      state.isLoggedIn = true;
      state.isInitialized = true;
      state.coreInfo = action?.payload;
    },
    startLogoutAction(state) {
      state.isLoggedIn = false;
      state.isInitialized = true;
      state.coreInfo = null;
    },
    startFetchCoreInfoAction(state, action) {
      state.coreInfo = action?.payload?.coreInfo;
    },
    setCoreInfo(state, action) {
      state.coreInfo = action?.payload;
    }
  }
});

export default account.reducer;

export const { startLoginAction, startLogoutAction, startFetchCoreInfoAction, setCoreInfo } = account.actions;
