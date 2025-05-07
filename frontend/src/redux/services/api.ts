import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '../../utils/cookie';
import { setUser } from './authSlice';
import { createAction } from '@reduxjs/toolkit';


const setUserData = createAction("setUser")


export const api = createApi({
  reducerPath: 'api',
  baseQuery:fetchBaseQuery({
	  baseUrl: import.meta.env.VITE_API_URL,
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
		}),
		async onQueryStarted(_arg,{dispatch,queryFulfilled}){
			try {
				const {data} = queryFulfilled;
				dispatch(setUserData(data))
			} catch (error) {
				console.log(error)
			}
		},
		
  }),
 	 GetUsers:builder.query({
		query:()=>({
		url:'/users/withoutme',
		method:'GET',
	})
	}),

	SendMessage:builder.mutation({
		query:(message)=>({
			url:'/messages',
			method:'POST',
			body:message,
		})
	}),

	GetMessages:builder.query({
		query:(id)=>({
			url:`/messages/${id}`,
			method:'GET',
		})
	}),

})
});

export const { useLoginMutation,useRegisterMutation,useMeQuery,useGetUsersQuery,useSendMessageMutation} = api;