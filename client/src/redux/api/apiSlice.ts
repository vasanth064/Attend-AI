import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setCredentials, logout, Tokens } from '../authentication/authSlice';
import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:3000/v1',
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const refreshQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 403) {
    console.log('Refreshing token');
    const refreshTokenRes = await baseQuery(
      '/auth/refresh-tokens',
      api,
      extraOptions
    );
    if (refreshTokenRes?.data) {
      const user = (api.getState() as RootState).auth.user;
      api.dispatch(
        setCredentials({
          tokens: refreshTokenRes.data as Tokens,
          user,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: refreshQuery,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  endpoints: (builder) => ({}),
  tagTypes: ['Session', 'Auth', 'InviteLink', 'Machine'],
});
