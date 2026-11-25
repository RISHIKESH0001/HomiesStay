import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCurrentAccount, loginAccount, logoutAccount, getApiErrorMessage, getProfilePictureUrl } from '../services/api';

if (typeof window !== 'undefined') {
	window.localStorage.removeItem('homies-stay-user');
}

const normalizeAccount = (account) => ({
	...account,
	initials: account.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
	profileImage: getProfilePictureUrl(account.profileImage),
});

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
	try {
		return await getCurrentAccount();
	} catch {
		return null;
	}
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
	try {
		return await loginAccount(credentials);
	} catch (error) {
		return rejectWithValue({
			message: getApiErrorMessage(error, 'Unable to sign in. Please try again.'),
			adminContactEmail: error?.response?.data?.adminContactEmail || null,
		});
	}
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
	try {
		await logoutAccount();
	} catch (error) {
		return rejectWithValue(getApiErrorMessage(error, 'Unable to sign out. Please try again.'));
	}
});

const initialState = {
	isAuthenticated: false,
	user: null,
	sessionStatus: 'checking',
	authStatus: 'idle',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		profileUpdated: (state, action) => {
			state.user = normalizeAccount(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(restoreSession.pending, (state) => {
				state.sessionStatus = 'checking';
			})
			.addCase(restoreSession.fulfilled, (state, action) => {
				state.sessionStatus = 'ready';
				state.isAuthenticated = Boolean(action.payload);
				state.user = action.payload ? normalizeAccount(action.payload) : null;
			})
			.addCase(loginUser.pending, (state) => {
				state.authStatus = 'authenticating';
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.authStatus = 'idle';
				state.isAuthenticated = true;
				state.user = normalizeAccount(action.payload);
			})
			.addCase(loginUser.rejected, (state) => {
				state.authStatus = 'idle';
			})
			.addCase(logoutUser.pending, (state) => {
				state.authStatus = 'signing-out';
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.authStatus = 'idle';
				state.isAuthenticated = false;
				state.user = null;
			})
			.addCase(logoutUser.rejected, (state) => {
				state.authStatus = 'idle';
			});
	},
});

export const { profileUpdated } = authSlice.actions;
export default authSlice.reducer;
