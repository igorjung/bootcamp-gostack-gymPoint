import styled from 'styled-components/native';

export const Container = styled.View`
  height: 46px;
  background: #fff;

  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 10px 0px 0px #ddd;
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
