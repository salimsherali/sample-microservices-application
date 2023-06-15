import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './components/Login';
import Dashboard from './components/admin/Dashboard';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// Assume you have a function to check the token, e.g., checkToken()
const checkToken = () => {
  const token = localStorage.getItem('token');
  return !!token; // Check if token is present or not
};

ReactDOM.render(
  <React.StrictMode>
    {checkToken() ? <Dashboard /> : <Login />}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
