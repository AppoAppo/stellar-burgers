import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredients';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const loading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);

  if (loading && ingredients.length === 0) {
    return <Preloader />;
  }

  const ingredientData = ingredients.find((ing) => ing._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
