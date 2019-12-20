import styled from 'styled-components';
import { darken } from 'polished';
import { Form } from '@rocketseat/unform';

export const Filter = styled.div`
  z-index: 1;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => (props.visible ? 'block' : 'none')};
`;

export const AnswerContainer = styled(Form)`
  z-index: 3;
  position: absolute;
  left: calc(50% - 175px);
  top: calc(50% - height);
  width: 100%;
  max-width: 350px;
  text-align: center;
  display: ${props => (props.visible ? 'flex' : 'none')};
  background: #fff;
  border-radius: 4px;
  padding: 10px 20px;
  flex-direction: column;

  strong {
    margin-top: 20px;
    font-size: 12px;
    text-align: left;
    color: #333;
  }

  p {
    margin-top: 10px;
    font-size: 14px;
    text-align: left;
    word-break: break-all;
    color: #999;
  }

  textarea {
    margin-top: 10px;
    padding: 5px 15px;
    width: 100%;
    min-height: 100px;
    border: 1px solid #ddd;
    border-radius: 4px;
    word-break: break-all;
    resize: none;
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

  div {
    position: absolute;
    right: 30px;
    top: 2px;

    button {
      border: 0;
      background: none;

      &:hover {
        background: none;
      }
    }
  }
`;

export const Table = styled.table`
  border-spacing: 0;
  margin: 30px 0;
  width: 100%;
  background: #fff;
  padding: 30px 25px;
  color: #333;

  tr {
    td {
      border-spacing: 100px;
      padding: 15px 0;
      color: #999;
      font-size: 12px;

      button {
        border: 0;
        background: none;
        color: #3b9eff;
        margin-left: 20px;
      }

      strong {
        font-size: 14px;
        color: #333;
        display: block;
      }
    }

    & + tr + tr {
      td {
        border-top: 1px solid #eee;
      }
    }
  }
`;
