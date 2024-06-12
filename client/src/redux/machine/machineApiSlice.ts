import { apiSlice } from '../api/apiSlice';
import { SignupRequest } from '../authentication/authApiSlice';
import { User } from '../authentication/authSlice';

export interface Session {
  id: number;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  clientID: number;
};

export interface MarkAttendanceResponse {
  message: string;
  id: number;
  enrollmentID: number;
  attendanceMarkedAt: Date;
  user: any;
  imgUrl: string;
}

export const machineApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMachines: builder.query<User[], void>({
      query: () => ({
        url: '/client/machine',
        method: 'GET',
      }),
    }),
    deleteMachine: builder.mutation<void, string>({
      query: (id) => ({
        url: `/client/machine/${id}`,
        method: 'DELETE',
      }),
    }),
    createMachine: builder.mutation<void, SignupRequest>({
      query: (machine) => ({
        url: '/client/machine',
        method: 'POST',
        body: machine,
        transformResponse: (response: {
          data: {
            machine: User;
          };
        }) => response.data.machine,
      }),
    }),

    getSessionsForMachine: builder.query<Session[], void>({
      query: () => ({
        url: '/machine/getLogs',
        method: 'GET',
      }),
      transformResponse: (response: { sessions: Session[] }) => response.sessions,
    }),
    markAttendance: builder.mutation<MarkAttendanceResponse, { sessionID: string, file: Blob }>({
      query: ({ sessionID, file }) => {
        let formData = new FormData();
        formData.append("sessionID", sessionID);
        formData.append("file", file);

        return {
          url: '/machine/markAttendance',
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data;'
          },
          formData: true
        }
      }
    })
  }),
});

apiSlice.enhanceEndpoints({
  addTagTypes: ['Machine'],
  endpoints: {
    createMachine: {
      invalidatesTags: ['Machine'],
    },
    getMachines: {
      providesTags: ['Machine'],
    },
    deleteMachine: {
      invalidatesTags: ['Machine'],
    },
  },
});

export const {
  useCreateMachineMutation,
  useGetMachinesQuery,
  useDeleteMachineMutation,
  useGetSessionsForMachineQuery,
  useMarkAttendanceMutation
} = machineApiSlice;
