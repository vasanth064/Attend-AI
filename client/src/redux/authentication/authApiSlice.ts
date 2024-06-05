import { apiSlice } from './../api/apiSlice';
import { Tokens, User } from './authSlice';
interface LoginRequest {
  email: string;
  password: string;
}
interface AuthResponse {
  user: User;
  tokens: Tokens;
}
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: ({ email, password, name }) => ({
        url: '/auth/register',
        method: 'POST',
        body: { email, password, name },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useSignupMutation } =
  authApiSlice;
