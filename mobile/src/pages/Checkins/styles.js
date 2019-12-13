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

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { marginTop: 15 },
})`
  width: 100%;
`;

export const Item = styled.View`
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  height: 46px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;

  margin-bottom: 10px;
  padding: 5px 15px;
`;

export const Number = styled.Text`
  font-weight: bold;
  color: #333;
`;

export const Time = styled.Text`
  color: #999;
`;
