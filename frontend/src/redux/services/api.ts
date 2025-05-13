import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '../../utils/cookie';
import { RootState } from '../store';
import { refreshToken, setUser } from './authSlice';


const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_API_URL,
	prepareHeaders: (headers) => {
	  const token = getCookie("access_token");
	  if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	  }
	  return headers;
	},
  })

  const baseQueryWithReauth = async (
	args,
	api,
	extraOptions
  ) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const refresh_token = (api.getState() as RootState).auth.refresh_token;
  
	  if (refresh_token) {
		const refreshResult = await baseQuery(
		  {
			url: '/auth/refresh-token',
			method: 'POST',
			body: { refresh_token },
		  },
		  api,
		  extraOptions
		);
  
		if (refreshResult.data) {
		  const newTokens = refreshResult.data
		  api.dispatch(refreshToken(newTokens));
  
		  result = await baseQuery(args, api, extraOptions);
		}
	  }
	}
  
	return result;
  };



export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
		async onQueryStarted(arg, { dispatch, queryFulfilled }) {
			try {
				const { data } = await queryFulfilled;
				dispatch(setUser(data));
			} catch (error) {
				console.log(error);
			}
		}
		
		
  }),
 	 GetConverstations:builder.query({
		query:()=>({
		url:'/conversation/my',
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
			url:`/conversation/${id}`,
			method:'GET',
		})
	}),

})
});

export const { useLoginMutation,useRegisterMutation,useMeQuery,useGetConverstationsQuery,useSendMessageMutation,
useGetMessagesQuery

} = api;