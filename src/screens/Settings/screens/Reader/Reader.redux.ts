import { AppState } from '@redux/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  changeReaderBackground,
  changeReaderDirection,
  toggleSkipChaptersMarkedRead,
  toggleKeepDeviceAwake,
  toggleShowPageNumber,
} from '@redux/reducers/settingsReducer';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => ({
  ...props,
  settings: state.settings.reader,
});

const connector = connect(mapStateToProps, {
  changeReaderBackground,
  changeReaderDirection,
  toggleSkipChaptersMarkedRead,
  toggleKeepDeviceAwake,
  toggleShowPageNumber,
});

export type ConnectedReaderSettingsScreenProps = ConnectedProps<typeof connector>;

export default connector;
