import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  selectAllOrders,
  selectFeedLoading
} from '../../services/slices/feed';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
