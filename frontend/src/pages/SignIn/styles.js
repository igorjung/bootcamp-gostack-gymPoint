import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  height: 100%;
  overflow-y: auto;
  background: #e25965;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 315px;
  text-align: center;

  form {
    background: #fff;
    border-radius: 2px;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    img {
      height: 60px;
      width: 90px;
      align-self: center;
    }

    strong {
      margin: 20px 0 10px;
      text-align: left;
    }

    input {
      padding: 0px 15px;
      height: 44px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      border: 0;
      border-radius: 4px;
      height: 44px;
      margin-top: 10px;
      font-weight: bold;
      color: white;
      background: #e25965;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.03, '#E25965')};
      }
    }

    span {
      color: #fb6f93;
      align-self: center;
      margin: 5px 0 10px;
      font-weight: bold;
    }
  }
`;
