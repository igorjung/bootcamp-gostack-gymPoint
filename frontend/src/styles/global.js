import { createGlobalStyle } from 'styled-components';

import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

*{
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

*:focus {
  outline: 0;
}

html,body, #root {
  height: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
}

body, input, button, textarea {
  font: 14px 'Roboto', sans-serif;
}

span {
  display: block;
  margin-top: 5px;
  color: #fb6f93;
  align-self: center;
  margin: 5px 0 10px;
  font-weight: bold;
}

a {
  text-decoration: none;
  cursor: pointer;
}

ul {
  list-style: none;
}

button {
  cursor: pointer;
}
`;