import { createSlice } from '@reduxjs/toolkit';

const savedUser = window.localStorage.getItem('homies-stay-user');

const initialState = {
	isAuthenticated: Boolean(savedUser),
	user: savedUser ? JSON.parse(savedUser) : null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state, action) => {
			state.isAuthenticated = true;
			state.user = action.payload;
			window.localStorage.setItem('homies-stay-user', JSON.stringify(action.payload));
		},
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
			window.localStorage.removeItem('homies-stay-user');
		},
	},
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
