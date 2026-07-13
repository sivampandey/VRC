import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('vrc_token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['User', 'Address', 'BlogPost'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['User']
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['User']
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body
      })
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body
      })
    }),
    verifyRegistration: builder.mutation({
      query: (body) => ({
        url: '/auth/verify-registration',
        method: 'POST',
        body
      }),
      invalidatesTags: ['User']
    }),
    resendOTP: builder.mutation({
      query: (body) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body
      })
    }),
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User']
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/users/profile',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['User']
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/users/password',
        method: 'PUT',
        body
      })
    }),
    
    // Addresses
    getAddresses: builder.query({
      query: () => '/users/profile',
      transformResponse: (response) => response.addresses,
      providesTags: ['Address']
    }),
    addAddress: builder.mutation({
      query: (body) => ({
        url: '/users/addresses',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Address', 'User']
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/addresses/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Address', 'User']
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/users/addresses/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Address', 'User']
    }),

    // Admin user listings
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User']
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),

    // Blog / Journal CRUD
    getBlogPosts: builder.query({
      query: () => '/blog',
      providesTags: ['BlogPost']
    }),
    getBlogPostBySlug: builder.query({
      query: (slug) => `/blog/${slug}`,
      providesTags: ['BlogPost']
    }),
    createBlogPost: builder.mutation({
      query: (body) => ({
        url: '/blog',
        method: 'POST',
        body
      }),
      invalidatesTags: ['BlogPost']
    }),
    updateBlogPost: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/blog/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['BlogPost']
    }),
    deleteBlogPost: builder.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['BlogPost']
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyRegistrationMutation,
  useResendOTPMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  
  useGetBlogPostsQuery,
  useGetBlogPostBySlugQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation
} = authApi
