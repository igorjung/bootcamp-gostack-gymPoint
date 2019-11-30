import styled from 'styled-components';
import { darken } from 'polished';
import { Form } from '@rocketseat/unform';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-size: 20px;
    color: #333;
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const LinkRegister = styled.div`
  border: 0;
  border-radius: 4px;
  padding: 0 10px;
  height: 30px;
  background: #e25965;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  strong {
    font-weight: bold;
    color: #fff;
    margin-left: 5px;
  }

  &:hover {
    background: ${darken(0.03, '#e25965')};
  }
`;

export const InputContent = styled(Form)`
  height: 30px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    border: 0;
    background: none;
  }

  input {
    margin-left: 5px;
    border: 0;
    background: none;

    &::placeholder {
      color: #999;
    }
  }
`;

export const LinkBack = styled.div`
  border: 0;
  border-radius: 4px;
  padding: 0 10px;
  height: 30px;
  background: #ddd;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  strong {
    font-weight: bold;
    color: #fff;
    margin-left: 5px;
  }

  &:hover {
    background: ${darken(0.03, '#ddd')};
  }
`;

export const ButtonSave = styled.button`
  border: 0;
  border-radius: 4px;
  padding: 0 10px;
  height: 30px;
  background: #e25965;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  strong {
    font-weight: bold;
    color: #fff;
    margin-left: 5px;
  }

  &:hover {
    background: ${darken(0.03, '#e25965')};
  }
`;

export const RefreshContent = styled.button`
  background: none;
  border: 0;
  padding: 0;
  margin-left: 10px;
`;
