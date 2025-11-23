import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { isAxiosError } from 'axios';
import type { AuthUser, AuthCredentials } from '../../types/auth';
import { AUTH_STORAGE_KEY } from '../../constants';

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  status: 'idle',
  error: null,
  hydrated: false
};

const storeUser = async (user: AuthUser | null) => {
  if (user) {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const hydrateAuth = createAsyncThunk<AuthUser | null>('auth/hydrate', async () => {
  const cached = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  return cached ? (JSON.parse(cached) as AuthUser) : null;
});

export const loginUser = createAsyncThunk<AuthUser, AuthCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const username = credentials.email.split('@')[0];
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password: credentials.password
      });

      const user: AuthUser = {
        id: response.data.id,
        name: `${response.data.firstName ?? ''} ${response.data.lastName ?? ''}`.trim() ||
          response.data.username ||
          username,
        email: credentials.email,
        token: response.data.token
      };

      await storeUser(user);
      return user;
    } catch (error) {
      const message =
        isAxiosError(error) && typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : 'Unable to login. Please check your credentials.';
      return rejectWithValue(message);
    }
  }
);

interface RegisterArgs {
  name: string;
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk<AuthUser, RegisterArgs, { rejectValue: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const trimmedName = payload.name.trim() || 'Expo User';
      const [firstName, ...rest] = trimmedName.split(' ');
      const lastName = rest.join(' ') || 'User';

      const response = await axios.post('https://dummyjson.com/users/add', {
        firstName,
        lastName,
        email: payload.email,
        password: payload.password
      });

      const user: AuthUser = {
        id: response.data?.id ?? Date.now(),
        name: `${response.data?.firstName ?? firstName} ${response.data?.lastName ?? lastName}`.trim(),
        email: payload.email
      };

      await storeUser(user);
      return user;
    } catch (error) {
      const message =
        isAxiosError(error) && typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : 'Unable to register at the moment. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await storeUser(null);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = Boolean(action.payload);
        state.hydrated = true;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(hydrateAuth.rejected, state => {
        state.hydrated = true;
      })
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.status = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(registerUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Registration failed';
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.isLoggedIn = false;
        state.status = 'idle';
        state.error = null;
      });
  }
});

export default authSlice.reducer;
