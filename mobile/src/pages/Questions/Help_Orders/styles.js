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
  contentContainerStyle: { marginTop: 15, paddingBottom: 15 },
})`
  width: 100%;
`;

export const Item = styled.TouchableOpacity`
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  min-height: 46px;

  justify-content: center;
  align-self: stretch;

  margin-bottom: 10px;
  padding: 5px 15px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AnswerContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const AnswerText = styled.Text`
  font-weight: bold;
  color: ${props => (props.answer ? '#32CD32' : '#999')};
  margin-left: 5px;
`;

export const Time = styled.Text`
  color: #999;
`;

export const Info = styled.Text`
  color: #999;
  margin-top: 10px;
`;
