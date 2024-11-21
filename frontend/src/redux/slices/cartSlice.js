import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

// Thunk asynchrone pour récupérer les articles du panier
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (_, thunkAPI) => {
  try {
    const response = await cartService.getCartItems();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour ajouter un article au panier
export const addCartItem = createAsyncThunk('cart/addCartItem', async (itemData, thunkAPI) => {
  try {
    const response = await cartService.addCartItem(itemData);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour mettre à jour un article du panier
export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ id, quantity }, thunkAPI) => {
  try {
    const response = await cartService.updateCartItem(id, { quantity });
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour supprimer un article du panier
export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id, thunkAPI) => {
  try {
    const response = await cartService.deleteCartItem(id);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Thunk asynchrone pour vider le panier
export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    const response = await cartService.clearCart();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// État initial du panier
const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// Création du Slice panier
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.meta.arg);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;