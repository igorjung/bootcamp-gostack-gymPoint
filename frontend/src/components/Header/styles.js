import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

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

export const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
    padding-right: 20px;
    border-right: 1px solid #eee;

    strong {
      font-size: 14px;
      color: #e25965;
      margin-left: 10px;
    }

    img {
      height: 25px;
      width: 45px;
    }
  }
`;

export const MenuLink = styled(NavLink)`
  font-size: 14px;
  font-weight: bold;
  color: #999;
  margin-left: 20px;
`;
