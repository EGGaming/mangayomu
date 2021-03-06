import {
  MangaLibReducerAction,
  MangaLibReducerState,
} from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';
import { StringComparator } from '@utils/Algorithms';

const INITIAL_STATE: MangaLibReducerState = {
  search: '',
  mangas: {},
};

export default function (
  state: MangaLibReducerState = INITIAL_STATE,
  action: MangaLibReducerAction
): MangaLibReducerState {
  switch (action.type) {
    case 'REHYDRATE':
      return {
        ...state,
      };
    case 'SET_SEARCH_QUERY_IN_LIBRARY':
      return {
        ...state,
        search: action.query,
      };

    case 'ADD_TO_LIBRARY':
      return {
        ...state,
        mangas: {
          ...state.mangas,
          [action.payload.link]: null,
        },
      };
    case 'REMOVE_FROM_LIBRARY': {
      const newState = { ...state, mangas: { ...state.mangas } };
      delete newState.mangas[action.payload.link];
      return newState;
    }
    default:
      return state;
  }
}
