import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "../../utils/cookie";

const AuthSlice = createSlice({
	name:"auth",
	initialState:{
		user:null,
		access_token: getCookie("access_token") || null,
		refresh_token: getCookie("refresh_token") || null,
		isLoading:false

	},
	reducers:{
		setUser:(state,action)=>{
			state.user = action.payload;
			state.access_token = action.payload.access_token;
			state.refresh_token = action.payload.refresh_token;

		},
		logout:(state)=>{
			state.user = null;
			state.access_token = null;
			state.refresh_token = null;
		},

	
	}
})

export const {setUser,logout} = AuthSlice.actions;
export default AuthSlice.reducer; // AuthSlice.reducer, authSlice.actions