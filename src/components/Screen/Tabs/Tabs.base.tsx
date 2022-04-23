import { Constants } from '@theme/core';
import { Platform, TouchableNativeFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';

export const TabsContainer = styled.View`
  ${(props) => css`
    background-color: ${props.theme.palette.background.paper.get()};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `}
`;

export const TabContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(2)};
    align-items: center;
    flex-grow: 1;
  `}
`;

export const TabButtonBase = styled(Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback).attrs(
  (props) => {
    if (Platform.OS === 'ios') {
      return {
        activeOpacity: 0.5,
      };
    }
    return {
      background: TouchableNativeFeedback.Ripple(
        props.theme.palette.primary[props.theme.palette.mode ?? 'light'].get(),
        true
      ),
    };
  }
)``;
