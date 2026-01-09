import ingredientsReducer from './slices/ingredients';
import feedReducer from './slices/feed';
import userReducer from './slices/user';
import constructorReducer from './slices/constructor';
import orderReducer from './slices/order';
import { rootReducer } from './store';

describe('rootReducer', () => {
  const unknownAction = { type: 'UNKNOWN_ACTION' };
  const state = rootReducer(undefined, unknownAction);
  it('должен возвращать начальное состояние для неизвестного действия', () => {
    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction)
    });
  });
});
