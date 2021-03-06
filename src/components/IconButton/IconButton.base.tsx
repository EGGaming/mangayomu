import { rem } from '@theme/Typography';
import styled, { css } from 'styled-components/native';

export const IconButtonBaseContainer = styled.View`
  ${(props) => css`
    width: 40px;
    align-items: center;
    justify-content: center;
    height: 40px;
  `}
`;
