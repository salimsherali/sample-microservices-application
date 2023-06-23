import React, { useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../asset/css/Login.css'; // Import custom CSS for Login component styling

const Login = () => {
  const api_base_url = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Clear previous error
    setError('');

    // Validate required fields
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Login successful, store the token in local storage
   
    // Make the API call to login
    axios
      .post(`${api_base_url}/login`, {
        username: email,
        password: password,
      })
      .then((response) => {
        // console.log('response:', response);
        const data = response.data;
        // console.log('response.data:', responses.data);
        if (data.status) {
          try{

            // Login successful, store the token in local storage
            localStorage.setItem('token', data.result.token);
            localStorage.setItem('user_data', JSON.stringify(data.result.user));
            // Redirect to the dashboard
            window.location.href = '/dashboard';
          }catch(error){
            console.error('Error:', error);
            setError('Error in token. ' + error.message);
          }
         
        } else {
          // Login failed, display error message
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred during login. ' + error.message);
      });
  };

  return (
    <div className="login-container">
      <Container>
        <h1>Login</h1>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          {error && <Alert className='mt-4' variant="danger">{error}</Alert>}

          <Button variant="primary" className='mt-2' type="submit">
            Login
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
