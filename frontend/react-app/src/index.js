
import React from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import {checkToken} from './asset/utils/helper';

import './index.css';
import App from './components/app/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';



const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Router>
    <App/>
    {/* {checkToken() ? <Dashboard /> : <Login />} */}
  </Router>

);  

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();