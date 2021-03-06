import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import { ChapterPressableMode, ChapterProps } from './Chapter.interfaces';
import * as chaptersListReducerActions from '@redux/reducers/chaptersListReducer/';
import * as mangaDownloadingReducerActions from '@redux/reducers/mangaDownloadingReducer/';
import { ChaptersListReducerState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import { DownloadStatus } from '@utils/DownloadManager';
import { ChapterState } from '@redux/reducers/mangaDownloadingReducer/mangaDownloadingReducer.interfaces';

const mapStateToProps = (state: AppState, props: ChapterProps) => {
  return props;
};

const connector = connect(mapStateToProps, { ...chaptersListReducerActions, ...mangaDownloadingReducerActions });

export type ChapterReduxProps = ConnectedProps<typeof connector> & {
  isSelected: boolean;
  selectionMode: ChapterPressableMode;
  status: DownloadStatus;
} & ChapterState;

export default connector;
