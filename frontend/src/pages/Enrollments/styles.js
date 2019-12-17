import styled from 'styled-components';

import { Form } from '@rocketseat/unform';

export const FormContainer = styled(Form)`
  border-spacing: 0;
  margin: 30px 0;
  width: auto;
  background: #fff;
  padding: 30px 25px;
  color: #333;

  strong {
    display: block;
    text-align: left;
    font-size: 12px;
    color: #333;
    margin-top: 10px;
  }

  span {
    margin-top: 10px;
  }
`;

export const InputContainer = styled.input`
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 40px;
  padding: 15px;
  width: 100%;
`;

export const FlexLine = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & + div {
    margin-left: 20px;
  }
`;
