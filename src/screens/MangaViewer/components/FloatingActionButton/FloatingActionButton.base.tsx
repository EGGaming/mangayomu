import styled, { css } from 'styled-components/native';
import Animated, { FadeIn, FadeOutRight } from 'react-native-reanimated';
import { shadowDrop } from '@theme/core';

export const FloatingActionButtonContainer = styled(Animated.View).attrs(shadowDrop)`
  ${(props) => css`
    background-color: ${props.theme.palette.primary.main.get()};
    border-radius: 1000px;
    bottom: ${props.theme.spacing(4)};
    left: ${props.theme.spacing(4)};
  `}
`;

export const FloatingActionButtonBase = styled(Animated.View)`
  ${(props) => css`
    padding: ${props.theme.spacing(2)};
    width: 56px;
    height: 56px;
  `}
`;

export const FloatingContainer = styled.View.attrs({
  pointerEvents: 'box-none',
})`
  ${(props) => css`
    position: absolute;
    flex-direction: row-reverse;
    align-items: flex-end;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
  `}
`;
