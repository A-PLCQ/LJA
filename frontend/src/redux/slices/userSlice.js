import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

// Thunk asynchrone pour récupérer le profil de l'utilisateur
export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (_, thunkAPI) => {
  try {
    const response = await userService.getUserProfile();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour mettre à jour le profil de l'utilisateur
export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async (userData, thunkAPI) => {
  try {
    const response = await userService.updateUserProfile(userData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour supprimer un utilisateur
export const deleteUser = createAsyncThunk('user/deleteUser', async (password, thunkAPI) => {
  try {
    const response = await userService.deleteUser(password);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// État initial de l'utilisateur
const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

// Création du Slice utilisateur
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.status = 'idle';
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
