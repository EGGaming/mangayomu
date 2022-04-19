import { Skeleton, Flex } from '@components/core';
import withAnimatedLoading from '@utils/withAnimatedLoading';
import { Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';

export const MangaItemContainerEven = styled.View`
  ${(props) => css`
    width: ${Dimensions.get('window').width / 2}px;
    align-items: flex-end;
    padding: ${props.theme.spacing(1, 3)};
  `}
`;

export const MangaItemContainerOdd = styled.View`
  ${(props) => css`
    width: ${Dimensions.get('window').width / 2}px;
    align-items: flex-start;
    padding: ${props.theme.spacing(1, 3)};
  `}
`;

export const MangaItemsLoading: React.FC = withAnimatedLoading(() => {
  return (
    <Flex wrap>
      {new Array(8).fill('').map((_, i) =>
        i % 2 === 1 ? (
          <MangaItemContainerOdd key={i}>
            <Skeleton.MangaComponent />
          </MangaItemContainerOdd>
        ) : (
          <MangaItemContainerEven key={i}>
            <Skeleton.MangaComponent />
          </MangaItemContainerEven>
        )
      )}
    </Flex>
  );
});
