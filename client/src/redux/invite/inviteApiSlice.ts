import { apiSlice } from '../api/apiSlice';
import { User } from '../authentication/authSlice';

export interface Option {
  label: string;
  value: string;
}

export interface FormConfig {
  id: string;
  label: string;
  type: string;
  options?: Option[];
}
export interface CreateInviteLink {
  name: string;
  config: FormConfig[] | string;
}
export interface InviteLink extends CreateInviteLink {
  id: string;
  clientId: string;
}

interface GetAllSignupRequest {
  inviteId: number;
  status: 'ENABLED' | 'DISABLED';
}

interface ApproveUserSignups {
  message: string;
  updatedUsers: {
    count: number;
  };
}

interface ModifiedUser extends User {
  inviteId: number | null;
}

export const inviteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvites: builder.query<InviteLink[], void>({
      query: () => ({
        url: '/client/link',
        method: 'GET',
      }),
    }),
    createInvite: builder.mutation<void, CreateInviteLink>({
      query: (data) => ({
        url: '/client/link',
        method: 'POST',
        body: data,
      }),
    }),
    getInvite: builder.query<InviteLink, string>({
      query: (id) => ({
        url: `/client/link/${id}`,
        method: 'GET',
      }),
      transformResponse: (data: InviteLink) => ({
        ...data,
        config: JSON.parse(data.config as string) as FormConfig[],
      }),
    }),
    deleteInvite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/client/link/${id}`,
        method: 'DELETE',
      }),
    }),
    getAllSignups: builder.query<User[], GetAllSignupRequest>({
      query: ({ inviteId, status }) => ({
        url: '/client/invitedUsers',
        method: 'GET',
        params: {
          inviteId,
          status,
        },
      }),
    }),
    approveUserSignups: builder.mutation<ApproveUserSignups, number[]>({
      query: (userIDs) => ({
        url: '/client/invitedUsers',
        method: 'POST',
        body: {
          userIDs,
        },
      }),
    }),
    enrollUser: builder.mutation<ModifiedUser, FormData>({
      query: (formData: FormData) => {
        return {
          url: '/users/enroll',
          method: 'POST',
          body: formData,
        }
      }
    })
  }),
});

apiSlice.enhanceEndpoints({
  addTagTypes: ['InviteLink', 'InvitedUsers'],
  endpoints: {
    getInvites: {
      providesTags: ['InviteLink'],
    },
    createInvite: {
      invalidatesTags: ['InviteLink'],
    },
    deleteInvite: {
      invalidatesTags: ['InviteLink'],
    },
    getAllSignups: {
      providesTags: ['InvitedUsers'],
    },
    approveUserSignups: {
      invalidatesTags: ['InvitedUsers'],
    },
  },
});

export const {
  useGetInvitesQuery,
  useCreateInviteMutation,
  useGetInviteQuery,
  useDeleteInviteMutation,
  useGetAllSignupsQuery,
  useApproveUserSignupsMutation,
  useEnrollUserMutation
} = inviteApiSlice;
