import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import '../../asset/css/App.css'; 
import Login from '../Login';
import Page404 from '../Page404';
import Dashboard from '../admin/Dashboard';
import MessageList from '../admin/message/MessageList';
import MessageCreate from '../admin/message/MessageCreate';
import { checkToken, appLayout, route_list } from '../../asset/utils/helper';
import { useLocation } from 'react-router-dom';


export default function App() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  if (!checkToken) {
    navigate('/login');
  }
  const location = useLocation();

  // fetch user data from local storage
  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData == null) {
      localStorage.removeItem('user_data');
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData != null) {
        var name = parsedUserData.name;
        setUserName(name);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');

    navigate('/login', { replace: true });
  };

  const current_layout = appLayout(location);
  const routes = route_list([<Login />,<Page404 />,<Dashboard />,<MessageList />, <MessageCreate />]);

  var container_class = '';
  switch(current_layout){   
    case 2:
        container_class = "dashboard-container";
        break;
    case 3:
        container_class = "list-container";
        break;
    default:
      break;
  }

  return (
    <div>

      <div className={container_class}>
        {current_layout === 1 ? '' :
          <Navbar bg="light" variant="light" className="dashboard-navbar">
            <Navbar.Brand>
              <span>Welcome,</span> {userName}
            </Navbar.Brand>
            <Nav className="ml-auto">
              <Button variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar>

          
        }

        <div>
          <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          </Routes>
        </div>

      </div>

    </div>
  );
}
