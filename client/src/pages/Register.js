// import { useState } from "react";
// import { Button, Form, Input, message } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Spinner from "../components/Spinner";
// import OtpVerification from "../components/OTP";
// import "../styles/Register.css";

// const Register = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [email, setEmail] = useState("");

//   const sendOtpHandler = async () => {
//     if (!email) return message.error("Enter your email first!");
//     try {
//       const res = await axios.post("/api/v1/otp/send-otp", { email });
//       message.success(res.data.message); 
//       setOtpSent(true);
//     } catch (error) {
//       message.error(error.response?.data?.message || "Failed to send OTP");
//     }
//   };

//   const handleOtpVerify = (status) => {
//     setOtpVerified(status);
//   };

//   const submitHandler = async (values) => {
//     if (!otpVerified) return message.error("Please verify your email first!");
//     try {
//       setLoading(true);
//       await axios.post("/api/v1/user/register", values);
//       setLoading(false);
//       message.success("Registration successful");
//       navigate("/login");
//     } catch (error) {
//       setLoading(false);
//       message.error(error.response?.data?.error || "Registration failed");
//     }
//   };

//   return (
//     <div className="register-page d-flex flex-column align-items-center justify-content-center">
//       <h1 className="project-title mb-4 text-center">Expense Manager</h1>

//       <div
//         className="register-card shadow-lg p-4 rounded"
//         style={{ width: "100%", maxWidth: 400 }}
//       >
//         {loading && <Spinner className="spinner" />}
//         <h2 className="text-center mb-3">Register</h2>

//         <Form layout="vertical" onFinish={submitHandler}>
//           <Form.Item
//             label="Username"
//             name="username"
//             rules={[{ required: true, message: "Please enter your username!" }]}
//           >
//             <Input type="text" autoComplete="username" />
//           </Form.Item>

//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               { required: true, message: "Please enter your email!" },
//               { type: "email", message: "Please enter a valid email!" },
//             ]}
//           >
//             <Input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               autoComplete="email"
//             />
//           </Form.Item>

//           {!otpSent && (
//             <Button type="default" block onClick={sendOtpHandler}>
//               Send OTP
//             </Button>
//           )}

//           {otpSent && !otpVerified && (
//             <>
//               <OtpVerification email={email} onVerify={handleOtpVerify} />
//               <p className="text-muted text-center mt-2">
//                 📧 Didn’t get the mail? Check your <strong>Inbox</strong> or{" "}
//                 <strong>Spam</strong> folder.
//               </p>
//             </>
//           )}

//           {otpVerified && (
//             <p className="text-success text-center">Email Verified ✅</p>
//           )}

//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: "Please enter your password!" }]}
//           >
//             <Input.Password autoComplete="new-password" />
//           </Form.Item>

//           <Form.Item>
//             <p className="text-center">
//               <Link to="/login" className="text-decoration-none">
//                 Already registered? <strong>Login</strong>
//               </Link>
//             </p>
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               block
//               disabled={!otpVerified}
//             >
//               Register
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Register;


import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import OtpVerification from "../components/OTP";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");

  const sendOtpHandler = async () => {
    if (!email) return message.error("Enter your email first!");
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return message.error("Please enter a valid email address");
    }
    
    try {
      const res = await axios.post("/api/v1/otp/send-otp", { email });
      message.success(res.data.message); 
      setOtpSent(true);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpVerify = (status) => {
    setOtpVerified(status);
  };

  const submitHandler = async (values) => {
    if (!otpVerified) return message.error("Please verify your email first!");
    
    // Validate password length
    if (values.password.length < 6) {
      return message.error("Password must be at least 6 characters long");
    }
    
    try {
      setLoading(true);
      const response = await axios.post("/api/v1/user/register", values);
      setLoading(false);
      message.success(response.data.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      if (error.response?.data?.errors) {
        // Display validation errors
        error.response.data.errors.forEach(err => message.error(err));
      } else {
        message.error(error.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="register-page d-flex flex-column align-items-center justify-content-center">
      <h1 className="project-title mb-4 text-center">Expense Manager</h1>

      <div
        className="register-card shadow-lg p-4 rounded"
        style={{ width: "100%", maxWidth: 400 }}
      >
        {loading && <Spinner className="spinner" />}
        <h2 className="text-center mb-3">Register</h2>

        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter your username!" },
              { min: 3, message: "Username must be at least 3 characters" }
            ]}
          >
            <Input type="text" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Form.Item>

          {!otpSent && (
            <Button type="default" block onClick={sendOtpHandler}>
              Send OTP
            </Button>
          )}

          {otpSent && !otpVerified && (
            <>
              <OtpVerification email={email} onVerify={handleOtpVerify} />
              <p className="text-muted text-center mt-2">
                📧 Didn't get the mail? Check your <strong>Inbox</strong> or{" "}
                <strong>Spam</strong> folder.
              </p>
            </>
          )}

          {otpVerified && (
            <p className="text-success text-center">Email Verified ✅</p>
          )}

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
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
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!otpVerified}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;