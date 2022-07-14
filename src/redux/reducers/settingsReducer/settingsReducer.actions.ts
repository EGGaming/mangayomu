import { ReaderBackgroundColor } from '@redux/reducers/settingsReducer/settingsReducer';
import { AppDispatch } from '@redux/store';
import { Dispatch } from 'redux';
import { SettingsReducerAction, SettingsReducerState } from './settingsReducer.interfaces';

export function finishIntro() {
  return (dispatch: Dispatch<SettingsReducerAction>) => {
    dispatch({ type: 'INTRO_DONE' });
  };
}

export function adjustColumns(c: number) {
  return (dispatch: Dispatch<SettingsReducerAction>) => {
    dispatch({ type: 'ADJUST_MANGAS_PER_COLUMN', payload: c });
  };
}

export function adjustTitleSize(c: number) {
  return (dispatch: Dispatch<SettingsReducerAction>) => {
    dispatch({ type: 'ADJUST_MANGAS_TITLES_PER_COLUMN', payload: c });
  };
}

export function changeReaderBackground(color: ReaderBackgroundColor) {
  return (dispatch: AppDispatch) => {
    console.log(`Changed background color to ${color}`);
    dispatch({ type: 'CHANGE_BACKGROUND_COLOR', color });
  };
}
