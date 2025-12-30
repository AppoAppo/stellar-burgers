import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TIngredient } from '../../utils/types';

type TConstructorIngredient = TIngredient & { id: string };

type ConstructorState = {
  buns: TIngredient | null;
  ingredients: TIngredient[];
};

const initialState: ConstructorState = {
  buns: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.buns = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (_, index) => index !== action.payload
      );
    },
    moveIngredient: (state, action) => {
      const { from, to } = action.payload;
      const [movedItem] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, movedItem);
    },
    clearConstructor: (state) => {
      state.buns = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const selectBuns = (state: { burgerConstructor: ConstructorState }) =>
  state.burgerConstructor.buns;
export const selectConstructorIngredients = (state: {
  burgerConstructor: ConstructorState;
}) => state.burgerConstructor.ingredients;

export default constructorSlice.reducer;
