import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  background: #e25965;
  height: 46px;
  border-radius: 4px;

  align-items: center;
  justify-content: center;
  align-self: stretch;
`;
export const Text = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
