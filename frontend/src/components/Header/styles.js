import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  background: #fff;
  padding: 0 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
`;

export const Content = styled.div`
  height: 56px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      height: 30px;
      width: 80px;
      margin-right: 10px;
      padding-right: 30px;
      border-right: 1px solid #eee;
    }

    a {
      font-size: 12px;
      font-weight: bold;
      color: #999;
      margin-left: 20px;

      &.current {
        color: #333;
      }
    }
  }

  div {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 12px;
      color: #999;
      display: block;
      text-align: right;
    }

    button {
      border: 0;
      background: none;
      margin-top: 5px;
      font-size: 10px;
      color: #e25965;
      text-align: right;
    }
  }
`;
