import styled from 'styled-components/native';

import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`;

export const Image = styled.Image.attrs({
  resizeMode: 'contain',
})`
  height: 80px;
`;

export const SubmitInput = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 46px;

  padding: 0 15px;
  margin-top: 30px;
  align-self: stretch;
`;

export const SubmitButton = styled(Button)`
  margin-top: 15px;
`;
