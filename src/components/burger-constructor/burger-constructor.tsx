import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectBuns,
  selectConstructorIngredients,
  clearConstructor
} from '../../services/slices/constructor';
import {
  orderBurger,
  selectCurrentOrder,
  clearCurrentOrder,
  selectOrderLoading
} from '../../services/slices/order';
import { selectIsAuth } from '../../services/slices/user';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const bun = useSelector(selectBuns);
  const ingredients = useSelector(selectConstructorIngredients);
  const orderModalData = useSelector(selectCurrentOrder);
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const constructorItems = {
    bun,
    ingredients
  };

  const orderRequest = useSelector(selectOrderLoading);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login');
      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];
    dispatch(orderBurger(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients as TConstructorIngredient[]).reduce(
        (s, v) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
