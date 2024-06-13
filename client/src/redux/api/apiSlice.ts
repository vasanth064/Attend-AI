import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setCredentials, logout, Tokens } from '../authentication/authSlice';
import { RootState } from '../store';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/v1`,
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken !== '' && accessToken !== null) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      } else {
        sessionStorage.setItem('accessToken', '');
      }
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
  endpoints: () => ({}),
  tagTypes: ['Session', 'Auth', 'InviteLink', 'Machine', 'AdminClientDetails'],
});
