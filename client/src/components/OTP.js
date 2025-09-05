import React, { useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import "../styles/OTP.css";

const OTP = ({ generatedOtp, onVerify }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const inputsRef = useRef([]);

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) { 
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === generatedOtp) {
      message.success("OTP verified successfully!");
      setOtpError("");
      onVerify(true); 
    } else {
      setOtpError("Wrong OTP");
      onVerify(false);
    }
  };

  return (
    <div className="otp-verification">
      <h4 className="text-center mb-3">Enter OTP</h4>
      <div className="otp-container">
        {otp.map((num, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="otp-input"
            value={num}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleOtpBackspace(e, index)}
          />
        ))}
      </div>
      {otpError && <div className="otp-error">{otpError}</div>}
      <Button
        type="primary"
        block
        style={{ marginTop: "1rem" }}
        onClick={handleSubmit}
      >
        Verify OTP
      </Button>
    </div>
  );
};

export default OTP;