import styled from 'styled-components/native';

import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  padding: 0 15px;

  background: #eee;
`;

export const SubmitButton = styled(Button)`
  margin-top: 15px;
`;

export const SubmitInput = styled.TextInput.attrs({
  textAlignVertical: 'top',
  maxLength: 255,
})`
  margin-top: 10px;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  height: 70%;
`;

export const IconContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
