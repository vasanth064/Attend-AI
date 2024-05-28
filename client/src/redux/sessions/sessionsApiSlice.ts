import { apiSlice } from './../api/apiSlice';

export interface CreateSession {
  name: string;
  startDateTime: string;
  endDateTime: string;
}

export interface Session extends CreateSession {
  id: string;
}

export const sessionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<Session[], void>({
      query: () => ({
        url: '/client/session/',
        method: 'GET',
      }),
      // transformResponse: (response: {
      //   data: {
      //     sessions: Session[];
      //   };
      // }) => response.data.sessions,
    }),
    getSession: builder.query<Session, string>({
      query: (id) => ({
        url: `/client/sessions/${id}`,
        method: 'GET',
        transformResponse: (response: {
          data: {
            session: Session;
          };
        }) => response.data.session,
      }),
    }),
    updateSession: builder.mutation<void, Session & { id: string }>({
      query: ({ id, ...session }) => ({
        url: `/client/sessions/${id}`,
        method: 'PUT',
        body: session,
        transformResponse: (response: {
          data: {
            session: Session;
          };
        }) => response.data.session,
      }),
    }),
    deleteSession: builder.mutation<void, string>({
      query: (id) => ({
        url: `/client/sessions/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useGetSessionQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} = sessionsApiSlice;
