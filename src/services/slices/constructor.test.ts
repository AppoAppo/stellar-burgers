import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructor';
import { orderBurger } from './order';
import { TIngredient, TOrder } from '../../utils/types';

describe('Срез конструктора бургера', () => {
  const bun: TIngredient = {
    _id: 'bun-1',
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
  };

  const sauce: TIngredient = {
    _id: 'sauce-1',
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
  };

  const main: TIngredient = {
    _id: 'main-1',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 0,
    calories: 250,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  const initialState = {
    buns: null,
    ingredients: []
  };

  it('должен корректно добавлять булочку', () => {
    const state = reducer(initialState, addIngredient(bun));
    expect(state.buns).toMatchObject(bun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен добавлять ингредиент в начинку', () => {
    const state = reducer(initialState, addIngredient(sauce));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(sauce);
  });

  it('должен удалять ингредиент по индексу', () => {
    let state = reducer(initialState, addIngredient(sauce));
    state = reducer(state, removeIngredient(0));

    expect(state.ingredients).toHaveLength(0);
  });

  it('должен перемещать ингредиенты в списке', () => {
    let state = reducer(initialState, addIngredient(sauce));
    state = reducer(state, addIngredient(main));

    expect(state.ingredients[0].name).toBe('Соус');
    expect(state.ingredients[1].name).toBe('Котлета');

    state = reducer(state, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients[0].name).toBe('Котлета');
    expect(state.ingredients[1].name).toBe('Соус');
  });

  it('должен очищать конструктор после успешного оформления заказа', () => {
    let state = reducer(initialState, addIngredient(bun));
    state = reducer(state, addIngredient(sauce));

    const action = orderBurger.fulfilled({} as TOrder, 'request-1', []);
    state = reducer(state, action);

    expect(state.buns).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
