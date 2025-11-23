import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { THEME_STORAGE_KEY } from '../../constants';

export type ThemeMode = 'light' | 'dark';

interface DarkModeState {
    mode: ThemeMode;
    hydrated: boolean;
}

const initialState: DarkModeState = {
    mode: 'light',
    hydrated: false
};

export const hydrateTheme = createAsyncThunk<ThemeMode>('theme/hydrate', async () => {
    try {
        const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        return (value as ThemeMode) ?? 'light';
    } catch {
        return 'light';
    }
});

export const setTheme = createAsyncThunk<ThemeMode, ThemeMode, { state: RootState }>(
    'theme/set',
    async (mode, { rejectWithValue }) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
            return mode;
        } catch {
            return rejectWithValue('Unable to persist theme');
        }
    }
);

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        // synchronous fallback if needed
        toggle(state) {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        }
    },
    extraReducers: builder => {
        builder
            .addCase(hydrateTheme.fulfilled, (state, action: PayloadAction<ThemeMode>) => {
                state.mode = action.payload;
                state.hydrated = true;
            })
            .addCase(hydrateTheme.rejected, state => {
                state.hydrated = true;
            })
            .addCase(setTheme.fulfilled, (state, action: PayloadAction<ThemeMode>) => {
                state.mode = action.payload;
            });
    }
});

export const { toggle } = darkModeSlice.actions;
export default darkModeSlice.reducer;
