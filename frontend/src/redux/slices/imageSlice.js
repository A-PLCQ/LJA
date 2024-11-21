import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import imageService from '../../services/imageService';

// Thunk asynchrone pour récupérer les images par produit (imprimante ou consommable)
export const fetchImagesByProduct = createAsyncThunk('images/fetchImagesByProduct', async ({ type, brand, model }, thunkAPI) => {
  try {
    const response = await imageService.getImagesByProduct(type, brand, model);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour ajouter une nouvelle image (admin ou manager requis)
export const addImage = createAsyncThunk('images/addImage', async (imageData, thunkAPI) => {
  try {
    const response = await imageService.addImage(imageData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour mettre à jour une image
export const updateImage = createAsyncThunk('images/updateImage', async ({ id, imageData }, thunkAPI) => {
  try {
    const response = await imageService.updateImage(id, imageData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour supprimer une image par ID
export const deleteImage = createAsyncThunk('images/deleteImage', async ({ type, brand, model, imageName }, thunkAPI) => {
  try {
    const response = await imageService.deleteImage(type, brand, model, imageName);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// État initial des images
const initialState = {
  images: [],
  status: 'idle',
  error: null,
};

// Création du Slice des images
const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImagesByProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchImagesByProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = action.payload;
      })
      .addCase(fetchImagesByProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.images.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        const index = state.images.findIndex((image) => image.id === action.payload.id);
        if (index !== -1) {
          state.images[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter((image) => image.name !== action.meta.arg.imageName);
        state.status = 'succeeded';
      });
  },
});

export default imageSlice.reducer;