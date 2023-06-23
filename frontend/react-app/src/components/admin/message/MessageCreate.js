import React, { useState } from 'react';
import { Container, Alert, Breadcrumb, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../asset/css/Create.css'; // Import custom CSS for Dashboard component styling

const MessageList = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [toNumber, setToNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleToNumberChange = (event) => {
    setToNumber(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform form validation
    if (!toNumber || !message) {
      setError('To Number and Message are required.');
      return;
    }

    if (message.length > 200) {
      setError('Message cannot exceed 200 characters.');
      return;
    }

    // Clear any previous errors
    setError('');

    try {
      // Make API request to create the message
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/message`, {
        toNumber,
        message,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Handle the response as needed
      console.log('Message created:', response.data);
      
      // Redirect to messages list page
      navigate('/messages', { replace: true });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create the message. Please try again.');
    }
  };

  return (
    <div>
      <Breadcrumb className="dashboard-breadcrumb">
        <Breadcrumb.Item onClick={() => navigate('/dashboard', { replace: true })}>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/messages', { replace: true })}>Messages</Breadcrumb.Item>
        <Breadcrumb.Item active>Create</Breadcrumb.Item>
      </Breadcrumb>
      {error && <Alert className="mt-2" variant="danger">{error}</Alert>}
      <Container className="mt-2 table-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="toNumber" >
            <Form.Label>To Number</Form.Label>
            <Form.Control type="text" placeholder="Enter the recipient's number" value={toNumber} onChange={handleToNumberChange} required />
          </Form.Group>

          <Form.Group controlId="message" className='mt-2'>
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Enter the message content" value={message} onChange={handleMessageChange} required maxLength={200} />
          </Form.Group>

          <Container className="btn_container">
            <Button variant="primary" type="submit">Submit</Button>
          </Container>
        </Form>
      </Container>
    </div>
  );
};

export default MessageList;
