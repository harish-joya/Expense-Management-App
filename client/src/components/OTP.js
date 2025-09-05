// src/components/OTP.js
import React, { useState, useRef } from "react";
import { Button, message } from "antd";
import axios from "axios";
import "../styles/OTP.css";

const OTP = ({ email, onVerify }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef([]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // digits only
    if (value.length <= 1) {
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < 5) inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }
    if (!email) {
      setOtpError("Email missing. Please enter email first.");
      return;
    }

    try {
      setSubmitting(true);
      setOtpError("");
      const { data } = await axios.post("/api/v1/otp/verify-otp", {
        email,
        otp: code,
      });
      if (data?.success) {
        message.success("OTP verified successfully!");
        onVerify(true);
      } else {
        setOtpError(data?.message || "Wrong OTP");
        onVerify(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Wrong OTP";
      setOtpError(msg);
      onVerify(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="otp-verification">
      <h4 className="text-center mb-3">Enter OTP</h4>

      <div className="otp-container">
        {otp.map((val, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-input"
            value={val}
            ref={(el) => (inputsRef.current[i] = el)}
            onChange={(e) => handleOtpChange(e, i)}
            onKeyDown={(e) => handleOtpKeyDown(e, i)}
          />
        ))}
      </div>

      {otpError && <div className="otp-error">{otpError}</div>}

      <Button
        type="primary"
        block
        onClick={handleSubmit}
        loading={submitting}
        style={{ marginTop: "1rem" }}
      >
        Verify OTP
      </Button>
    </div>
  );
};

export default OTP;
