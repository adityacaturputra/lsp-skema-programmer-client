import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
    <MantineProvider withNormalizeCSS withGlobalStyles>
        <Notifications />
        <App />
    </MantineProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
