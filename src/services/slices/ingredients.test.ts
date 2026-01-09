import reducer from './ingredients';
import { fetchIngredients } from './ingredients';
import { TIngredient } from '../../utils/types';

describe('ingredients reducer', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 200,
      price: 50,
      image: '',
      image_mobile: '',
      image_large: ''
    },
    {
      _id: '2',
      name: 'Соус',
      type: 'sauce',
      proteins: 1,
      fat: 2,
      carbohydrates: 3,
      calories: 30,
      price: 10,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  const initialState = undefined; // reducer сам вернёт initialState
  const request = 'request-1';

  it('pending: должен установить isLoading = true', () => {
    const action = fetchIngredients.pending(request);
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: должен сохранить ингредиенты и сбросить loading/ошибку', () => {
    const action = fetchIngredients.fulfilled(mockIngredients, request);
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('rejected: должен установить ошибку и сбросить loading', () => {
    const errorMessage = 'Не удалось получить ингредиенты';
    const action = fetchIngredients.rejected(
      null,
      request,
      undefined,
      errorMessage
    );
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
