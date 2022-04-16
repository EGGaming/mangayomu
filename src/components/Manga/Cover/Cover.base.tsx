import { MangaCoverProps } from '@components/Manga/Cover/Cover.interfaces';
import pixelToNumber from '@utils/pixelToNumber';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

export const MangaCoverBase = styled.Image<Omit<MangaCoverProps, 'uri'>>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
  `}
  ${(props) => {
    switch (props.size) {
      case 'medium':
        return css`
          width: ${RFValue(pixelToNumber(props.theme.spacing(13)))}px;
          height: ${RFValue(pixelToNumber(props.theme.spacing(20)))}px;
        `;
      case 'large':
        return css`
          width: ${RFValue(pixelToNumber(props.theme.spacing(26)))}px;
          height: ${RFValue(pixelToNumber(props.theme.spacing(40)))}px;
        `;
    }
  }}
`;
