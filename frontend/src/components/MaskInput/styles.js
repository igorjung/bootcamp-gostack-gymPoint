import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 40px;
  display: inline-block;

  input {
    border: 0;
    background: none;
    height: 40px;
    width: 80%;
    padding: 15px;
    margin: 0;

    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }

  p {
    position: absolute;
    right: 20px;
    top: 13px;
  }
`;
