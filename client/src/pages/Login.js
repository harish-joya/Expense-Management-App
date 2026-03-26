// import { useState, useEffect } from "react";
// import { Button, Form, Input } from "antd"; 
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Spinner from "../components/Spinner";
// import "../styles/Login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(""); 
//   const [showError, setShowError] = useState(false); // control fade-out

//   const submitHandler = async (values) => {
//     try {
//       setLoading(true);
//       setError("");
//       setShowError(false);

//       const { data } = await axios.post("/api/v1/user/login", values);
//       setLoading(false);

//       localStorage.setItem("user", JSON.stringify({ ...data, password: "" }));
//       navigate("/");
//     } catch (err) {
//       setLoading(false);
//       const errMsg =
//         err.response?.data?.message || "Something went wrong, try again";
//       setError(errMsg);
//       setShowError(true);

//       setTimeout(() => setShowError(false), 5000);
//     }
//   };

//   useEffect(() => {
//     if (localStorage.getItem("user")) {
//       navigate("/");
//     }
//   }, [navigate]);

//   return (
//     <div className="login-page d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
//       <h1 className="project-title mb-4 text-center">Expense Manager</h1>

//       <div className="login-card shadow p-4 rounded" style={{ width: "350px" }}>
//         {loading && <Spinner className="spinner" />}
//         <h2 className="text-center mb-3">Login</h2>

//         {/* Error Alert */}
//         {showError && <div className="login-error">{error}</div>}

//         <Form onFinish={submitHandler}>
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               { required: true, message: "Please enter your email!" },
//               { type: "email", message: "Please enter a valid email!" },
//             ]}
//           >
//             <Input type="email" autoComplete="email" />
//           </Form.Item>

//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: "Please enter your password!" }]}
//           >
//             <Input.Password autoComplete="current-password" />
//           </Form.Item>

//           <Form.Item className="text-center mb-3">
//             <Link to="/register">Not a User? Click here to Register</Link>
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" block>
//               Login
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useState, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [showError, setShowError] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      setError("");
      setShowError(false);

      const { data } = await axios.post("/api/v1/user/login", values);
      setLoading(false);

      localStorage.setItem("user", JSON.stringify({ ...data, password: "" }));
      navigate("/");
    } catch (err) {
      setLoading(false);
      const errMsg =
        err.response?.data?.message || "Something went wrong, try again";
      setError(errMsg);
      setShowError(true);

      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleForgotPassword = async () => {
  if (!forgotPasswordEmail) {
    setForgotPasswordMessage("Please enter your email address");
    return;
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(forgotPasswordEmail)) {
    setForgotPasswordMessage("Please enter a valid email address");
    return;
  }

  try {
    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");
    
    const response = await axios.post("/api/v1/user/forgot-password", {
      email: forgotPasswordEmail
    });
    
    let message = response.data.message;
    
    // For development, show the token if it's returned
    if (response.data.resetToken) {
      message += ` | Token: ${response.data.resetToken}`;
    }
    
    setForgotPasswordMessage(message);
    setForgotPasswordLoading(false);
    
    // ... rest of your code ...
  } catch (error) {
    // ... error handling ...
  }
};

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="login-page d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="project-title mb-4 text-center">Expense Manager</h1>

      <div className="login-card shadow p-4 rounded" style={{ width: "350px" }}>
        {loading && <Spinner className="spinner" />}
        <h2 className="text-center mb-3">Login</h2>

        {/* Error Alert */}
        {showError && <div className="login-error">{error}</div>}

        <Form onFinish={submitHandler}>
          <Form.Item
            label="Email or Username"
            name="identifier"
            rules={[{ required: true, message: "Please enter your email or username!" }]}
          >
            <Input autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Form.Item className="text-center mb-1">
            <Button 
              type="link" 
              onClick={() => setForgotPasswordVisible(true)}
              style={{ padding: 0 }}
            >
              Forgot Password?
            </Button>
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

      {/* Forgot Password Modal */}
      <Modal
        title="Reset Password"
        open={forgotPasswordVisible}
        onCancel={() => {
          setForgotPasswordVisible(false);
          setForgotPasswordEmail("");
          setForgotPasswordMessage("");
        }}
        footer={null}
        centered
      >
        <div className="forgot-password-modal">
          <p>Enter your email address and we'll send you a link to reset your password.</p>
          
          <Form.Item label="Email" required>
            <Input
              type="email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Form.Item>
          
          {forgotPasswordMessage && (
            <div className={`forgot-password-message ${forgotPasswordMessage.includes("successfully") ? "success" : "error"}`}>
              {forgotPasswordMessage}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button 
              onClick={() => {
                setForgotPasswordVisible(false);
                setForgotPasswordEmail("");
                setForgotPasswordMessage("");
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleForgotPassword}
              loading={forgotPasswordLoading}
            >
              Send Reset Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;