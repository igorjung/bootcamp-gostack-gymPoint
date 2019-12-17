import styled from 'styled-components/native';

export const Container = styled.View`
  position: relative;
  height: 46px;
  padding: 10px;
  background: #fff;
  box-shadow: 10px 0px 0px #ddd;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const LogoContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const EmptyStyle = styled.View`
  height: 20px;
  width: 20px;
`;

export const Image = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

export const Text = styled.Text`
  font-weight: bold;
  color: #e25965;
`;

export const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
