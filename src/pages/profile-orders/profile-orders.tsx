import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders, selectUserOrders } from '../../services/slices/feed';
import { selectOrderLoading } from '../../services/slices/order';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const orderdLoading = useSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (orderdLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
