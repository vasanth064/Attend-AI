import { apiSlice } from './../api/apiSlice';

export const sessionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<any, void>({
      query: () => ({
        url: '/sessions',
        method: 'GET',
      }),
    }),
  }),
});

export const {} = sessionsApiSlice;
