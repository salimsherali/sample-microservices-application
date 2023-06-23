import React, { useState, useEffect } from 'react';
import { Container, Button, Badge, Alert,Breadcrumb} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../asset/css/Dashboard.css'; // Import custom CSS for Dashboard component styling
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  const [messageCount, setMessageCount] = useState(0);
  const [error, setError] = useState('');



  // Simulating API call to fetch message count
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status) {
          try {
            setMessageCount(data.result.message);
          } catch (error) {
            console.error('Error:', error);
            setError('Error in token. ' + error.message);
          }
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError('Error:' + error.message);
        if (error.response.status === 401) {
          localStorage.removeItem('user_data');
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      });
  }, [navigate]);


  const handleMessage = () => {
    navigate('/messages', { replace: true });
  };

  return (
    <div>
      {error && <Alert className="mt-2" variant="danger">{error}</Alert>}
      <Container className="mt-2">
        <div className="message-box">
          <h1 className="text-center">Messages</h1>
          <div className="row mt-4">
            <div className="col-4">
              <div className="badge-container">
                <Badge variant="primary">{messageCount}</Badge>
              </div>
            </div>
            <div className="col-8">
              <div className="button-container">
                <Button variant="primary" onClick={handleMessage} className="">
                  Messages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>

  );
};

export default Dashboard;
