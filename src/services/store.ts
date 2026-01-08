import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredients';
import feedReducer from './slices/feed';
import userReducer from './slices/user';
import constructorReducer from './slices/constructor';
import orderReducer from './slices/order';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
