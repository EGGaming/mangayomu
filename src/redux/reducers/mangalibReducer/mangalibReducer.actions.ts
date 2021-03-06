import { AppDispatch } from '@redux/store';
import { Manga } from '@services/scraper/scraper.interfaces';

export const addToLibrary = (manga: Manga) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'ADD_TO_LIBRARY', payload: manga });
  };
};

export const removeFromLibrary = (manga: Manga) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'REMOVE_FROM_LIBRARY', payload: manga });
  };
};

export const searchInLibrary = (query: string) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_SEARCH_QUERY_IN_LIBRARY', query });
  };
};
