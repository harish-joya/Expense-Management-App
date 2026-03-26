import { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    // Check if token is present
    if (!token) {
      message.error("Invalid reset link");
      navigate("/login");
      return;
    }
    
    // In a real app, you might verify the token validity with the backend
    setValidToken(true);
    setCheckingToken(false);
  }, [token, navigate]);

  const submitHandler = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/v1/user/reset-password", {
        token,
        password: values.password
      });
      
      setLoading(false);
      message.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  if (checkingToken) {
    return <Spinner />;
  }

  if (!validToken) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-card">
          <h2>Invalid Reset Link</h2>
          <p>The password reset link is invalid or has expired.</p>
          <Button type="primary" onClick={() => navigate("/login")}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page d-flex flex-column align-items-center justify-content-center">
      <h1 className="project-title mb-4 text-center">Expense Manager</h1>

      <div className="reset-password-card shadow p-4 rounded">
        {loading && <Spinner className="spinner" />}
        <h2 className="text-center mb-3">Reset Password</h2>
        
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your new password!" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;