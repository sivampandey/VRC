import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productsApi = createApi({
  reducerPath: 'productsApi',
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
  tagTypes: ['Product', 'Collection', 'Review'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params
      }),
      providesTags: ['Product']
    }),
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: ['Product']
    }),
    getBestsellers: builder.query({
      query: () => '/products/bestsellers',
      providesTags: ['Product']
    }),
    getNewArrivals: builder.query({
      query: () => '/products/new-arrivals',
      providesTags: ['Product']
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/products/${slug}`,
      providesTags: ['Product']
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Product']
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Product']
    }),
    
    // Collections
    getCollections: builder.query({
      query: () => '/collections',
      providesTags: ['Collection']
    }),
    getCollectionBySlug: builder.query({
      query: (slug) => `/collections/${slug}`,
      providesTags: ['Collection', 'Product']
    }),
    createCollection: builder.mutation({
      query: (body) => ({
        url: '/collections',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Collection']
    }),
    
    // Reviews
    getProductReviews: builder.query({
      query: (id) => `/reviews/products/${id}/reviews`,
      providesTags: ['Review']
    }),
    addReview: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/reviews/products/${id}/reviews`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Review', 'Product']
    }),
    approveReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/approve`,
        method: 'PUT'
      }),
      invalidatesTags: ['Review', 'Product']
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Review', 'Product']
    })
  })
})

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetBestsellersQuery,
  useGetNewArrivalsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  
  useGetCollectionsQuery,
  useGetCollectionBySlugQuery,
  useCreateCollectionMutation,
  
  useGetProductReviewsQuery,
  useAddReviewMutation,
  useApproveReviewMutation,
  useDeleteReviewMutation
} = productsApi
