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
    createSession: builder.mutation<Session, CreateSession>({
      query: ({ name, startDateTime, endDateTime }) => ({
        url: '/client/session',
        method: 'POST',
        body: {
          name,
          startDateTime,
          endDateTime,
        },
        transformResponse: (response: {
          data: {
            session: Session;
          };
        }) => response.data.session,
      }),
    }),
    getSessions: builder.query<Session[], void>({
      query: () => ({
        url: '/client/session/',
        method: 'GET',
      }),
      transformResponse: ({ sessions }) => sessions,
    }),
    getSession: builder.query<Session, string>({
      query: (id) => ({
        url: `/client/session/${id}`,
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
        url: `/client/session/${id}`,
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
        url: `/client/session/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

apiSlice.enhanceEndpoints({
  addTagTypes: ['Session'],
  endpoints: {
    createSession: {
      invalidatesTags: ['Session'],
    },
    getSessions: {
      providesTags: ['Session'],
    },
    deleteSession: {
      invalidatesTags: ['Session'],
    },
  },
});

export const {
  useCreateSessionMutation,
  useGetSessionsQuery,
  useGetSessionQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} = sessionsApiSlice;
