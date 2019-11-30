import styled from 'styled-components';
import { Form } from '@rocketseat/unform';

const FormContent = styled(Form)`
  border-spacing: 0;
  margin: 30px 0;
  width: 100%;
  background: #fff;
  padding: 30px 25px;
  color: #333;
  border-radius: 4px;

  strong {
    display: block;
    text-align: left;
    font-size: 12px;
    color: #333;
  }

  input {
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 40px;
    padding: 15px;
    width: 100%;
  }

  div {
    display: flex;
    flex-grow: 1;
    justify-content: flex-start;
    align-items: center;

    div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      & + div {
        margin-left: 20px;
      }
    }
  }

  div.currency {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 40px;
    padding: 0 15px;
    width: 90%;

    p {
      font-size: 14px;
      color: #333;
    }

    input {
      margin: 0;
      padding: 0 5px;
      background: none;
      border: 0;
      width: 100%;
      height: 100%;
      color: #333;
    }
  }
`;

export default FormContent;
