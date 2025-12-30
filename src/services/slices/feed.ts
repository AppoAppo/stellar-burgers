import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../../utils/burger-api';

type FeedState = {
  allOrders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
};

const initialState: FeedState = {
  allOrders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'feed/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      return data.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentOrder } = feedSlice.actions;

export const selectAllOrders = (state: { feed: FeedState }) =>
  state.feed.allOrders;
export const selectUserOrders = (state: { feed: FeedState }) =>
  state.feed.userOrders;
export const selectFeedTotal = (state: { feed: FeedState }) => state.feed.total;
export const selectFeedTotalToday = (state: { feed: FeedState }) =>
  state.feed.totalToday;
export const selectFeedLoading = (state: { feed: FeedState }) =>
  state.feed.isLoading;
export const selectFeedError = (state: { feed: FeedState }) => state.feed.error;

export const orderDataSelector =
  (orderNumber: string) => (state: { feed: FeedState }) => {
    if (state.feed.userOrders.length > 0) {
      const data = state.feed.userOrders.find(
        (order) => order.number === +orderNumber
      );
      if (data) {
        return data;
      }
    }
    if (state.feed.allOrders.length > 0) {
      const data = state.feed.allOrders.find(
        (order) => order.number === +orderNumber
      );
      if (data) {
        return data;
      }
    }

    if (state.feed.currentOrder?.number === +orderNumber) {
      return state.feed.currentOrder;
    }

    return null;
  };
export default feedSlice.reducer;
