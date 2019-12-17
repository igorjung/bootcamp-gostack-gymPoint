import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  margin: 30px 0;
  width: 100%;
  background: #fff;
  padding: 30px 25px 10px 25px;
  color: #333;

  tr {
    th {
      padding-bottom: 10px;
      font-size: 14px;
    }

    td {
      border-spacing: 100px;
      padding: 15px 0;
      color: #999;
      font-size: 12px;

      a {
        font-weight: normal;
        color: #3b9eff;
      }

      button {
        border: 0;
        background: none;
        color: #fb6f93;
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

export default Table;
