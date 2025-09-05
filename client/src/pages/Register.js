import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import OTP from "../components/OTP";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const sendOtpHandler = async () => {
    if (!email) return message.error("Enter your email first!");
    try {
      const { data } = await axios.post("/api/v1/otp/send-otp", { email });
      setGeneratedOtp(data.otp); 
      message.success("OTP sent to your email");
      setOtpSent(true);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpVerify = (status) => {
    setOtpVerified(status);
    if (status) message.success("Email verified ✅");
  };

  const submitHandler = async (values) => {
    if (!otpVerified) return message.error("Please verify your email first!");
    try {
      setLoading(true);
      await axios.post("/api/v1/user/register", values);
      setLoading(false);
      message.success("Registration successful");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-page d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="project-title mb-4 text-center">Expense Manager</h1>
      <div className="register-card shadow-lg p-4 rounded" style={{ width: "400px" }}>
        {loading && <Spinner className="spinner" />}
        <h2 className="text-center mb-3">Register</h2>

        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Enter username" }]}>
            <Input type="text" autoComplete="username" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Enter email" }]}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          {!otpSent && (
            <Button type="default" block onClick={sendOtpHandler}>Send OTP</Button>
          )}

          {otpSent && !otpVerified && (
            <OTP generatedOtp={generatedOtp} onVerify={handleOtpVerify} />
          )}

          {otpVerified && <p className="text-success text-center">Email Verified ✅</p>}

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Enter password" }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item>
            <p className="text-center">
              <Link to="/login" className="text-decoration-none">Already registered? Login</Link>
            </p>
          </Form.Item>

          <Form.Item>
            <Button className="register-btn" type="primary" htmlType="submit" block disabled={!otpVerified} >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
