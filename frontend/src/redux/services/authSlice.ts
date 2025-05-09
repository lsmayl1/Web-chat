import { createSlice } from "@reduxjs/toolkit";
import { getCookie, saveTokensToCookie } from "../../utils/cookie";

type User = {
	user_id:string;
	username:string;
	email:string;
	role:string;
	createdAt:string;
	updatedAt:string;
}

interface AuthState {
	user: User | null;
	access_token: string | null;
	refresh_token: string | null;
	user_role: string;
	isLoading: boolean;
  }

  const initialState: AuthState = {
	user: null,
	access_token: getCookie("access_token") || null,
	refresh_token: getCookie("refresh_token") || null,
	user_role: "",
	isLoading: true,
  };


const AuthSlice = createSlice({
	name:"auth",
	initialState,
	reducers:{
		setToken:(state,action)=>{
			state.access_token = action.payload.access_token;
			state.refresh_token = action.payload.refresh_token;
			state.user_role = action.payload.role;
			saveTokensToCookie(action.payload.access_token,action.payload.refresh_token)
			state.isLoading = false


		},
		refreshToken:(state,action)=>{
			state.access_token = action.payload.access_token;
			state.refresh_token = action.payload.refresh_token;
			saveTokensToCookie(action.payload.access_token,action.payload.refresh_token)
			state.isLoading = false
		},
		setUser:(state,action)=>{
			state.user = action.payload
			state.user_role = action.payload.role
			state.isLoading = false

		},
		logout:(state)=>{
			state.user = null;
			state.access_token = null;
			state.refresh_token = null;
			state.isLoading = false

		},

	}
})

export const {setToken,logout,setUser,refreshToken} = AuthSlice.actions;
export default AuthSlice.reducer; // AuthSlice.reducer, authSlice.actions