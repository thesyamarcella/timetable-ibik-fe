  import React, { useState } from 'react';
  import { Container, Form, Button } from 'react-bootstrap';
  import './Pages.css';
  import Jadwal from './Jadwal';

  const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();

      if (email === 'admin@example.com' && password === 'password') {
        setLoggedIn(true);
      } else {
        alert('Email or password is incorrect');
      }
    };

    if (loggedIn) {
      return (
        <Jadwal/>
      );
    }

    return (
      <Container>
            <div className="login-container">
              <h3>Login</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" block className='custom-button mt-2'>
                  Login
                </Button>
              </Form>
            </div>
      </Container>
    );
  };

  export default AdminLogin;
