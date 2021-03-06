import styled, { css } from 'styled-components/native';
import React from 'react';
import Flex from '@components/Flex';
import Spacer from '@components/Spacer';
import { TypographySkeleton } from '@components/Typography';
import { MangaBaseContainer } from '@components/Manga/Manga.base';
import pixelToNumber from '@utils/pixelToNumber';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';

const MangaSkeletonImage = styled.View<{ cols: number }>`
  ${(props) => css`
    width: ${props.theme.spacing(calculateCoverWidth(props.cols))};
    height: ${props.theme.spacing(calculateCoverHeight(props.cols))};
    border-radius: ${props.theme.borderRadius}px;
    background-color: ${props.theme.palette.action.disabledBackground.get()};
  `}
`;

const MangaSkeleton: React.FC = (props) => {
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const fontSize = useSelector((state: AppState) => state.settings.mangaCover.fontSize);
  const style = useSelector((state: AppState) => state.settings.mangaCover.style);
  switch (style) {
    default:
    case MangaCoverStyles.CLASSIC:
      return (
        <MangaBaseContainer cols={cols}>
          <Flex direction='column'>
            <MangaSkeletonImage cols={cols} />
            <Spacer y={0.5} />
            <TypographySkeleton width='100%' fontSize={fontSize} />
            <Spacer y={0.5} />
            <TypographySkeleton width='100%' fontSize={fontSize} />
          </Flex>
        </MangaBaseContainer>
      );
    case MangaCoverStyles.MODERN:
      return (
        <MangaBaseContainer cols={cols}>
          <MangaSkeletonImage cols={cols} />
        </MangaBaseContainer>
      );
  }
};

export default MangaSkeleton;
