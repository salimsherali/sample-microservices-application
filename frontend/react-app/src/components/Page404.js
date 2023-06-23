import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../asset/css/404.css';
import {checkToken} from '../asset/utils/helper';

const Page404 = () => {

  const navigate = useNavigate();

  return (
    <div className="login-container">
      <Container className="text-center">
        <h1>404</h1>
         {checkToken() ? 
          <Button variant="primary" onClick={()=>{navigate('/dashboard', { replace: true });}} className="mt-2">
          Return to Dashboard
          </Button>
         : 
         <Button variant="primary" onClick={()=>{navigate('/login', { replace: true });}} className="mt-2">
          Return to Login
          </Button>
         }      
      </Container>
    </div>
  );
};

export default Page404;
