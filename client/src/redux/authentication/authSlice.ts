import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
  clientID: string | null;
  userData: string | null;
  userType: string;
  status: string;
}

export interface Tokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}
interface LoginResponse {
  user: User | null;
  tokens: Tokens | null;
}
interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
}
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    accessToken: null,
  } as UserState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { user, tokens } = action.payload;
      if (tokens) {
        state.accessToken = tokens.access.token;
        state.isAuthenticated = true;
        state.user = user;
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: UserState }) => state.auth;
export const selectAccessToken = (state: { auth: UserState }) =>
  state.auth.accessToken;
