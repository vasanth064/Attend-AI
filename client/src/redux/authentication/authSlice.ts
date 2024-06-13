import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
  clientID: string | null;
  userData: string | null;
  userType: string;
  status: string;
  inviteID: string | null;
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
const accessTokenKey = sessionStorage.getItem('accessToken');
const user = sessionStorage.getItem('user');
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: user && user !== '' ? JSON.parse(user) : null,
    accessToken: accessTokenKey !== '' ? accessTokenKey : null,
  } as UserState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { user, tokens } = action.payload;
      if (tokens) {
        sessionStorage.setItem('accessToken', tokens.access.token);
        sessionStorage.setItem('user', JSON.stringify(user));
        state.accessToken = tokens.access.token;
        state.isAuthenticated = true;
        state.user = user;
      }
    },
    logout: (state) => {
      sessionStorage.setItem('accessToken', '');
      sessionStorage.setItem('user', '');
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
