import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import printerService from '../../services/printerService';

// Thunk asynchrone pour récupérer la liste des imprimantes
export const fetchPrinters = createAsyncThunk('printers/fetchPrinters', async (_, thunkAPI) => {
  try {
    const response = await printerService.getPrinters();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour récupérer les détails d'une imprimante par ID
export const fetchPrinterById = createAsyncThunk('printers/fetchPrinterById', async (id, thunkAPI) => {
  try {
    const response = await printerService.getPrinterById(id);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour ajouter une imprimante (admin ou manager requis)
export const addPrinter = createAsyncThunk('printers/addPrinter', async (printerData, thunkAPI) => {
  try {
    const response = await printerService.addPrinter(printerData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour mettre à jour une imprimante
export const updatePrinter = createAsyncThunk('printers/updatePrinter', async ({ id, printerData }, thunkAPI) => {
  try {
    const response = await printerService.updatePrinter(id, printerData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour supprimer une imprimante
export const deletePrinter = createAsyncThunk('printers/deletePrinter', async (id, thunkAPI) => {
  try {
    const response = await printerService.deletePrinter(id);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// État initial des imprimantes
const initialState = {
  printers: [],
  selectedPrinter: null,
  status: 'idle',
  error: null,
};

// Création du Slice imprimante
const printerSlice = createSlice({
  name: 'printers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrinters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrinters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.printers = action.payload;
      })
      .addCase(fetchPrinters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPrinterById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrinterById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedPrinter = action.payload;
      })
      .addCase(fetchPrinterById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addPrinter.fulfilled, (state, action) => {
        state.printers.push(action.payload);
      })
      .addCase(updatePrinter.fulfilled, (state, action) => {
        const index = state.printers.findIndex((printer) => printer.id === action.payload.id);
        if (index !== -1) {
          state.printers[index] = action.payload;
        }
      })
      .addCase(deletePrinter.fulfilled, (state, action) => {
        state.printers = state.printers.filter((printer) => printer.id !== action.meta.arg);
      });
  },
});

export default printerSlice.reducer;
