import { apiSlice } from '../api/apiSlice';

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
  }),
});

apiSlice.enhanceEndpoints({
  addTagTypes: ['InviteLink'],
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
  },
});

export const {
  useGetInvitesQuery,
  useCreateInviteMutation,
  useGetInviteQuery,
  useDeleteInviteMutation,
} = inviteApiSlice;
