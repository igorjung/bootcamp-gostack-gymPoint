import styled from 'styled-components/native';

export const Container = styled.View`
  position: relative;
  height: 46px;
  padding-top: 10px;
  background: #fff;
  box-shadow: 10px 0px 0px #ddd;
`;

export const LogoContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
  position: absolute;
  right: 20px;
  top: 15px;

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
