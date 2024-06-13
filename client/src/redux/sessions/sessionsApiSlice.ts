import { User } from '../authentication/authSlice';
import { ReportResponseObject } from '../users/userApiSlice';
import { apiSlice } from './../api/apiSlice';

export interface CreateSession {
  name: string;
  startDateTime: string;
  endDateTime: string;
}

export interface Session extends CreateSession {
  id: string;
}

interface EnrollUser {
  userID: number;
  sessionID: string;
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
    sessionReport: builder.query<ReportResponseObject[], number>({
      query: (sessionId: number) => {
        return {
          url: `/client/logs/${sessionId}`,
        };
      },
    }),
    getSessionUsers: builder.query<User[], string>({
      query: (id) => ({
        url: `/client/session/users/${id}`,
        method: 'GET',
      }),
    }),
    getClientUsers: builder.query<User[], void>({
      query: () => ({
        url: '/client/users/',
        method: 'GET',
      }),
    }),
    enrollUsers: builder.mutation<void, EnrollUser>({
      query: ({ userID, sessionID }) => ({
        url: '/client/enroll',
        method: 'POST',
        body: {
          userID,
          sessionID,
        },
      }),
    }),
    unEnrollUser: builder.mutation<void, EnrollUser>({
      query: ({ sessionID, userID }) => ({
        url: `/client/session/users`,
        method: 'DELETE',
        params: {
          sessionID,
          userID,
        },
      }),
    }),
    notEnrolledUsers: builder.query<
      User[],
      { sessionID: string; inviteID: string }
    >({
      query: ({ sessionID, inviteID }) => ({
        url: `/client/session/notEnrolledUsers`,
        method: 'GET',
        params: {
          sessionID,
          inviteID,
        },
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
    getSessionUsers: {
      providesTags: ['SessionUsers'],
    },
    getClientUsers: {
      providesTags: ['ClientUsers'],
    },
    enrollUsers: {
      invalidatesTags: ['SessionUsers', 'SessionNotUsers'],
    },
    notEnrolledUsers: {
      providesTags: ['SessionNotUsers'],
    },
    unEnrollUser: {
      invalidatesTags: ['SessionUsers', 'SessionNotUsers'],
    },
  },
});

export const {
  useCreateSessionMutation,
  useGetSessionsQuery,
  useGetSessionQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useGetSessionUsersQuery,
  useGetClientUsersQuery,
  useEnrollUsersMutation,
  useNotEnrolledUsersQuery,
  useUnEnrollUserMutation,
  useSessionReportQuery,
} = sessionsApiSlice;
