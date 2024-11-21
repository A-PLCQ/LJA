import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import consumableService from '../../services/consumableService';

// Thunk asynchrone pour récupérer la liste des consommables
export const fetchConsumables = createAsyncThunk('consumables/fetchConsumables', async (_, thunkAPI) => {
  try {
    const response = await consumableService.getConsumables();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour récupérer les détails d'un consommable par ID
export const fetchConsumableById = createAsyncThunk('consumables/fetchConsumableById', async (id, thunkAPI) => {
  try {
    const response = await consumableService.getConsumableById(id);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour ajouter un consommable (admin ou manager requis)
export const addConsumable = createAsyncThunk('consumables/addConsumable', async (consumableData, thunkAPI) => {
  try {
    const response = await consumableService.addConsumable(consumableData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour mettre à jour un consommable
export const updateConsumable = createAsyncThunk('consumables/updateConsumable', async ({ id, consumableData }, thunkAPI) => {
  try {
    const response = await consumableService.updateConsumable(id, consumableData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour supprimer un consommable
export const deleteConsumable = createAsyncThunk('consumables/deleteConsumable', async (id, thunkAPI) => {
  try {
    const response = await consumableService.deleteConsumable(id);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// État initial des consommables
const initialState = {
  consumables: [],
  selectedConsumable: null,
  status: 'idle',
  error: null,
};

// Création du Slice consommable
const consumableSlice = createSlice({
  name: 'consumables',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsumables.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConsumables.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.consumables = action.payload;
      })
      .addCase(fetchConsumables.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchConsumableById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConsumableById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedConsumable = action.payload;
      })
      .addCase(fetchConsumableById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addConsumable.fulfilled, (state, action) => {
        state.consumables.push(action.payload);
      })
      .addCase(updateConsumable.fulfilled, (state, action) => {
        const index = state.consumables.findIndex((consumable) => consumable.id === action.payload.id);
        if (index !== -1) {
          state.consumables[index] = action.payload;
        }
      })
      .addCase(deleteConsumable.fulfilled, (state, action) => {
        state.consumables = state.consumables.filter((consumable) => consumable.id !== action.meta.arg);
      });
  },
});

export default consumableSlice.reducer;
