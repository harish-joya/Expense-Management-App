import {useState, useEffect} from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const {data} = await axios.post('/api/v1/user/login', values);
      setLoading(false);
      message.success('Login successful');
      localStorage.setItem('user', JSON.stringify({...data,password:''}));
      navigate('/');
    } catch (error) {
      setLoading(false);
      message.error('Something went wrong');
    }
  };

  useEffect(()=>{
    if(localStorage.getItem('user')){
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="login-page d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="project-title mb-4 text-center">Expense Manager</h1>

      <div className="login-card shadow p-4 rounded" style={{ width: "350px" }}>
        {loading && <Spinner className="spinner" />}
        <h2 className="text-center mb-3">Login</h2>

        <Form onFinish={submitHandler}>
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
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Form.Item className="text-center mb-3">
            <Link to="/register">Not a User? Click here to Register</Link>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;