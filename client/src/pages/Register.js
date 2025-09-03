import { useState, useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/v1/user/register', values);
      setLoading(false);

      if (response.data.success) {
        message.success('Registration successful');
        navigate('/login');
      } else {
        message.error('Registration failed');
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.error || 'Something went wrong');
      console.error("Register error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="register-page d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="project-title mb-4 text-center">Expense Manager</h1>

      <div className="register-card shadow-lg p-4 rounded" style={{ width: "400px" }}>
        {loading && <Spinner className="spinner" />}
        <h2 className="text-center mb-3">Register</h2>

        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input type="text" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input type="email" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item>
            <p className="text-center">
              <Link to="/login" className="text-decoration-none">
                Already registered? <strong>Login</strong>
              </Link>
            </p>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
