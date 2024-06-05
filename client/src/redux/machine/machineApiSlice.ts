import { apiSlice } from '../api/apiSlice';
import { SignupRequest } from '../authentication/authApiSlice';
import { User } from '../authentication/authSlice';

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
} = machineApiSlice;
