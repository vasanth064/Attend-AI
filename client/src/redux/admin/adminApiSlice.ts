import { apiSlice } from './../api/apiSlice';

export interface CreateClientRequest {
  email: string;
  password: string;
  name: string;
  userData: string;
}

interface User extends CreateClientRequest {
  id: number;
  userType: string;
  status: string;
}

interface CreateClientResponse {
  user: User;
}

interface Message {
  message: string;
}

interface ClientInfo {
  id: number;
  name: string;
}


export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createClient: builder.mutation<CreateClientResponse, CreateClientRequest>({
      query: ({ email, password, name, userData }) => ({
        url: '/admin',
        method: "POST",
        body: {
          email,
          password,
          name,
          userData
        }
      }),
      invalidatesTags: ["AdminClientDetails"],
    }),
    deleteClient: builder.mutation<Message, { id: number }>({
      query: ({ id }: { id: number }) => ({
        url: `/admin/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["AdminClientDetails"],
    }),
    getAllClients: builder.query<ClientInfo[], void>({
      query: () => ({
        url: '/admin',
        method: "GET"
      }),
      providesTags: ["AdminClientDetails"],
    }),
    getClientById: builder.query<ClientInfo, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/${id}`,
        method: "GET"
      })
    })
  })
})

export const { useCreateClientMutation, useDeleteClientMutation, useGetAllClientsQuery, useGetClientByIdQuery } = adminApiSlice;

