import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  selectAllOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/slices/feed';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectAllOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);

  const readyOrders: number[] = getOrders(orders, 'done');

  const pendingOrders: number[] = getOrders(orders, 'pending');

  const feed: { total: number; totalToday: number } = {
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
