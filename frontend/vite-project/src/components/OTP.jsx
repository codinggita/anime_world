import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function OTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email not found. Please try again");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/verify-otp", {
        email,
        otp,
      });
      if (response.data.valid) {
        navigate("/new-password", { state: { email, otp } });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20"></div>

      <motion.div
        className="relative z-10 bg-gray-800/40 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-red-400 mb-6 neon-glow">
          Enter OTP
        </h2>

        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="otp" className="block text-gray-300 font-medium mb-2">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-red-400"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg border border-red-400 hover:shadow-red-400/50 transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
          >
            Verify OTP
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default OTP;