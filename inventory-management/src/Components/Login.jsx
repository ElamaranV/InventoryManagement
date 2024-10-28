import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      if (response.data.success) {
        setSuccess('Password correct. Please check your email for OTP.');
        setIsOtpSent(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred during login.');
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
      if (response.data.success) {
        setSuccess('OTP verified. Redirecting to dashboard...');
        
        // Navigate to the dashboard after OTP verification
        setTimeout(() => {
          navigate('/dashboard'); // Redirects within the app without changing the URL immediately
        }, 2000); // 2 seconds delay for a better user experience
        
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred during OTP verification.');
    }
  };

  return (
    <div className="login-container">
      <Form onSubmit={isOtpSent ? handleOtpVerification : handleLogin}>
        <h2 className="login-title">{isOtpSent ? 'Enter OTP' : 'Login'}</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {!isOtpSent && (
          <>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          </>
        )}

        {isOtpSent && (
          <Form.Group>
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>
        )}

        <Button type="submit" className="login-button">
          {isOtpSent ? 'Verify OTP' : 'Login'}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
