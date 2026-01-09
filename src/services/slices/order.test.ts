import reducer, { orderBurger, clearCurrentOrder } from './order';
import { TOrder } from '../../utils/types';

describe('Срез заказа', () => {
  const initialState = {
    currentOrder: null,
    isLoading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: 'abc123',
    number: 54321,
    name: 'Бургер "Тестовый"',
    status: 'done',
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: '2025-01-10T12:01:00.000Z',
    ingredients: ['1', '2']
  };

  const errorMessage = 'Не удалось оформить заказ';

  describe('orderBurger', () => {
    it('pending - должен установить флаг загрузки', () => {
      const action = orderBurger.pending('request-1', [
        'Ингредиент 1',
        'Ингредиент 2'
      ]);
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentOrder).toBeNull();
    });

    it('fulfilled - должен сохранить полученный заказ', () => {
      const action = orderBurger.fulfilled(mockOrder, 'request-1', [
        'Ингредиент 1',
        'Ингредиент 2'
      ]);
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('rejected - должен записать ошибку', () => {
      const action = orderBurger.rejected(
        null,
        'request-1',
        ['Ингредиент 1', 'Ингредиент 2'],
        errorMessage
      );
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentOrder).toBeNull();
    });
  });

  describe('clearCurrentOrder', () => {
    it('должен полностью очищать состояние текущего заказа', () => {
      const dirtyState = {
        currentOrder: mockOrder,
        isLoading: true,
        error: 'Старая ошибка'
      };

      const state = reducer(dirtyState, clearCurrentOrder());

      expect(state).toEqual(initialState);
    });
  });
});
