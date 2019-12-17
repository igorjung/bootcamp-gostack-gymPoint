import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  padding: 0 15px;

  background: #eee;
`;

export const AnswerContainer = styled.View`
  margin-top: 10px;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
`;

export const AnswerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AnswerStrong = styled.Text`
  font-weight: bold;
  color: #333;
`;

export const Time = styled.Text`
  color: #999;
`;

export const AnswerText = styled.Text`
  color: #999;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const IconContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
