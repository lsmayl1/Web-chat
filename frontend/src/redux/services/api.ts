import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '../../utils/cookie';

export const api = createApi({
  reducerPath: 'api',
  baseQuery:fetchBaseQuery({
	  baseUrl: `http://localhost:3000/`,
	  prepareHeaders: (headers) => {
		const token = getCookie("access_token");
		if (token) {
		  headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	  },
	}),
  endpoints: (builder) => ({
	Register:builder.mutation({
	query:(user)=>({
		url:'auth/register',
		method:'POST',
		body:user,
	})
	}),
	Login:builder.mutation({
		query:(user)=>({
			url:'auth/login',
			method:'POST',
			body:user,
		})
		}),
	me:builder.query({
		query:()=>({
			url:'auth/me',
			method:'GET',
		})
  }),
  }),
});

export const { useLoginMutation,useRegisterMutation,useMeQuery} = api;