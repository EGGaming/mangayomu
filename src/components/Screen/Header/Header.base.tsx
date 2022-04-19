import { AppState } from '@redux/store';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { StatusBar, Image, Linking, View, ViewProps } from 'react-native';
import { useSelector } from 'react-redux';
import styled, { css, DefaultTheme } from 'styled-components/native';
import React from 'react';
import IconButton from '../../IconButton';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { HoldItem } from 'react-native-hold-menu';
import { ThemedStyledProps } from 'styled-components';
import { useMangaSource } from '@services/scraper';

const generateCSS = (props: ThemedStyledProps<ViewProps & React.RefAttributes<View>, DefaultTheme>) => css`
padding-top: ${
  StatusBar.currentHeight ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 2) : props.theme.spacing(2)
};
background-color: ${props.theme.palette.background.paper.get()};
padding-horizontal: ${props.theme.spacing(3)};
padding-bottom: ${props.theme.spacing(2)};
height: ${
  StatusBar.currentHeight ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 8) : props.theme.spacing(8)
}
display: flex;
flex-direction: row;
align-items: center;
`;

export const HeaderBaseContainerNoHorizontalPadding = styled.View`
  ${generateCSS}
`;

export const HeaderBaseContainer = styled.View`
  ${generateCSS}
`;

export const MangaSource: React.FC = () => {
  const mangaSource = useMangaSource();
  const menuItems: MenuItemProps[] = React.useMemo(
    () => [
      {
        text: mangaSource.getName(),
        isTitle: true,
        withSeparator: true,
      },
      {
        text: 'Change Source',
        onPress: () => {},
        icon: 'book-open',
      },
      {
        text: 'View Website',
        onPress: () => {
          Linking.openURL(`https://${mangaSource.getLink()}`);
        },
        icon: 'link',
      },
      {
        text: 'Report Source',
        isDestructive: true,
        icon: 'flag',
      },
    ],
    [mangaSource]
  );
  return (
    <HoldItem activateOn='tap' hapticFeedback='Heavy' items={menuItems}>
      <IconButton icon={<Image source={{ uri: mangaSource.getIcon() }} style={{ width: 24, height: 24 }} />} />
    </HoldItem>
  );
};
