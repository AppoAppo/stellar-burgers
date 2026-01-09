import reducer, {
  fetchFeed,
  fetchUserOrders,
  fetchOrderByNumber
} from './feed';
import { TFeedsResponse } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

describe('Срез feed (extraReducers)', () => {
  const initialState = {
    allOrders: [],
    userOrders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
    currentOrder: null
  };

  const mockFeedData: TFeedsResponse = {
    success: true,
    orders: [{ _id: '1', number: 12345 } as TOrder],
    total: 1000,
    totalToday: 50
  };

  const mockUserOrders = [{ _id: '2', number: 67890 } as TOrder];
  const mockOrder = { _id: '3', number: 11111 } as TOrder;
  const errorMessage = 'Ошибка сети';

  describe('fetchFeed', () => {
    it('pending - должен установить флаг загрузки и очистить ошибку', () => {
      const action = fetchFeed.pending('request-1');
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled - должен сохранить данные ленты заказов и сбросить загрузку', () => {
      const action = fetchFeed.fulfilled(mockFeedData, 'request-1');
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.allOrders).toEqual(mockFeedData.orders);
      expect(state.total).toBe(mockFeedData.total);
      expect(state.totalToday).toBe(mockFeedData.totalToday);
      expect(state.error).toBeNull();
    });

    it('rejected - должен записать ошибку и сбросить флаг загрузки', () => {
      const action = fetchFeed.rejected(
        null,
        'request-1',
        undefined,
        errorMessage
      );
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.allOrders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });

  describe('fetchUserOrders', () => {
    it('pending - должен установить флаг загрузки и очистить ошибку', () => {
      const action = fetchUserOrders.pending('request-1');
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled - должен сохранить заказы пользователя и сбросить загрузку', () => {
      const action = fetchUserOrders.fulfilled(mockUserOrders, 'request-1');
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.userOrders).toEqual(mockUserOrders);
      expect(state.error).toBeNull();
    });

    it('rejected - должен записать ошибку и сбросить флаг загрузки', () => {
      const action = fetchUserOrders.rejected(
        null,
        'request-1',
        undefined,
        errorMessage
      );
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.userOrders).toEqual([]);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('pending - должен установить флаг загрузки и очистить ошибку', () => {
      const action = fetchOrderByNumber.pending('request-1', 12345);
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled - должен сохранить данные конкретного заказа и сбросить загрузку', () => {
      const action = fetchOrderByNumber.fulfilled(
        mockOrder,
        'request-1',
        11111
      );
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('rejected - должен записать ошибку и сбросить флаг загрузки', () => {
      const action = fetchOrderByNumber.rejected(
        null,
        'request-1',
        99999,
        errorMessage
      );
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentOrder).toBeNull();
    });
  });
});
