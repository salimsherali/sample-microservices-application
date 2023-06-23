import React, { useState, useEffect } from 'react';
import { Container, Alert, Breadcrumb, Table, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../asset/css/List.css'; // Import custom CSS for Dashboard component styling

const MessageList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [record, setRecord] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/messages/?page=${currentPage}&limit=10&search=${searchTerm}&sortField=${sortField}&sortOrder=${sortOrder}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = response.data;
        if (data.status) {
          setRecord(data.result.records);
          setTotalPages(data.result.totalPages);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error in token. ' + error.message);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('user_data');
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      }
    };

    fetchData();
  }, [currentPage, searchTerm, sortField, sortOrder, navigate]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const viewMessage = (message) => {
    setSelectedMessage(message);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
  };

  const viewStatus = async (message) => {
    setSelectedMessage(message);
    setShowStatusModal(true);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/message/${message.id}/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = response.data;
      if (data.status) {
        setStatusData(data.result);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error in token. ' + error.message);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('user_data');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortFieldChange = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <Breadcrumb className="dashboard-breadcrumb">
        <Breadcrumb.Item onClick={() => navigate('/dashboard', { replace: true })}>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Messages</Breadcrumb.Item>
      </Breadcrumb>
      {error && <Alert className="mt-2" variant="danger">{error}</Alert>}
      <Container className="mt-2 table-container">
        <div className="search-sort-container">
          <div className='col'>
            <Button variant="primary" onClick={() => navigate('/message/create', { replace: true })} className="mr-2">Create Message</Button>
          </div>
          <div className='col'>
            <Form.Group className="search-container">
              <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
            </Form.Group>
          </div>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                DateTime
                <button
                  className={`sort-btn ${sortField === 'createdAt' ? 'active' : ''}`}
                  onClick={() => handleSortFieldChange('createdAt')}
                >
                  {sortField === 'createdAt' && sortOrder === 'ASC' ? (
                    <i className="arrow-up"></i>
                  ) : (
                    <i className="arrow-down"></i>
                  )}
                </button>
              </th>
              <th>
                To
                <button
                  className={`sort-btn ${sortField === 'to_number' ? 'active' : ''}`}
                  onClick={() => handleSortFieldChange('to_number')}
                >
                  {sortField === 'to_number' && sortOrder === 'ASC' ? (
                    <i className="arrow-up"></i>
                  ) : (
                    <i className="arrow-down"></i>
                  )}
                </button>
              </th>
              <th>
                Status
                <button
                  className={`sort-btn ${sortField === 'status' ? 'active' : ''}`}
                  onClick={() => handleSortFieldChange('status')}
                >
                  {sortField === 'status' && sortOrder === 'ASC' ? (
                    <i className="arrow-up"></i>
                  ) : (
                    <i className="arrow-down"></i>
                  )}
                </button>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {record.map((message) => (
              <tr key={message.id}>
                <td>{formatDate(message.createdAt)}</td>
                <td>{message.to_number}</td>
                <td className='text-center'>{message.status}</td>
                <td className='text-center'>
                  <Button variant="primary" onClick={() => viewMessage(message)}>View Message</Button>{' '}
                  <Button variant="secondary" onClick={() => viewStatus(message)}>Check Status</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {totalPages > 1 && (
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>

      {/* View Message Modal */}
      <Modal show={showViewModal} onHide={closeViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <div>
              <h5>Date: {formatDate(selectedMessage.createdAt)}</h5>
              <p>To: {selectedMessage.to_number}</p>
              <p>Message: {selectedMessage.message && String.fromCharCode.apply(null, selectedMessage.message.data)}</p>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Check Status Modal */}
      <Modal show={showStatusModal} onHide={closeStatusModal}>
        <Modal.Header closeButton>
          <Modal.Title>Message Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {statusData ? (
            <div>
              <h5>Status: {statusData.status}</h5>
            </div>
          ) : (
            <p>Loading status...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeStatusModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MessageList;
