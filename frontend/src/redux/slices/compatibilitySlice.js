import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import compatibilityService from '../../services/compatibilityService';

// Thunk asynchrone pour récupérer les imprimantes compatibles pour un consommable
export const fetchCompatiblePrinters = createAsyncThunk('compatibility/fetchCompatiblePrinters', async (consumableId, thunkAPI) => {
  try {
    const response = await compatibilityService.getCompatiblePrintersByConsumable(consumableId);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour récupérer les consommables compatibles pour une imprimante
export const fetchCompatibleConsumables = createAsyncThunk('compatibility/fetchCompatibleConsumables', async (printerId, thunkAPI) => {
  try {
    const response = await compatibilityService.getCompatibleConsumablesByPrinter(printerId);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour ajouter une relation de compatibilité (admin ou manager requis)
export const addCompatibility = createAsyncThunk('compatibility/addCompatibility', async (compatibilityData, thunkAPI) => {
  try {
    const response = await compatibilityService.addCompatibility(compatibilityData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour supprimer une relation de compatibilité
export const deleteCompatibility = createAsyncThunk('compatibility/deleteCompatibility', async ({ printerId, consumableId }, thunkAPI) => {
  try {
    const response = await compatibilityService.deleteCompatibility(printerId, consumableId);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// État initial des compatibilités
const initialState = {
  compatiblePrinters: [],
  compatibleConsumables: [],
  status: 'idle',
  error: null,
};

// Création du Slice compatibilité
const compatibilitySlice = createSlice({
  name: 'compatibility',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompatiblePrinters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompatiblePrinters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.compatiblePrinters = action.payload;
      })
      .addCase(fetchCompatiblePrinters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCompatibleConsumables.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompatibleConsumables.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.compatibleConsumables = action.payload;
      })
      .addCase(fetchCompatibleConsumables.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCompatibility.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(deleteCompatibility.fulfilled, (state, action) => {
        state.status = 'succeeded';
      });
  },
});

export default compatibilitySlice.reducer;