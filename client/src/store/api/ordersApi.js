import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
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
  tagTypes: ['Order', 'CustomOrder'],
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Order']
    }),
    getMyOrders: builder.query({
      query: () => '/orders/my',
      providesTags: ['Order']
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ['Order']
    }),
    getAllOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order']
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Order']
    }),
    updateOrderTracking: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/tracking`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Order']
    }),

    // Payments
    createRazorpayOrder: builder.mutation({
      query: (body) => ({
        url: '/payments/create-order',
        method: 'POST',
        body
      })
    }),
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: '/payments/verify',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Order']
    }),

    // Custom Orders
    submitCustomInquiry: builder.mutation({
      query: (body) => ({
        url: '/custom-orders',
        method: 'POST',
        body
      }),
      invalidatesTags: ['CustomOrder']
    }),
    getAllCustomInquiries: builder.query({
      query: () => '/custom-orders',
      providesTags: ['CustomOrder']
    }),
    getMyCustomInquiries: builder.query({
      query: () => '/custom-orders/my',
      providesTags: ['CustomOrder']
    }),
    updateInquiryStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/custom-orders/${id}/status`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['CustomOrder']
    }),
    deleteCustomInquiry: builder.mutation({
      query: (id) => ({
        url: `/custom-orders/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['CustomOrder']
    })
  })
})

export const {
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useSubmitCustomInquiryMutation,
  useGetAllCustomInquiriesQuery,
  useGetMyCustomInquiriesQuery,
  useUpdateInquiryStatusMutation,
  useDeleteCustomInquiryMutation
} = ordersApi
