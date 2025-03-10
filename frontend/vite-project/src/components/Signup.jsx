import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function App() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/signup", formData);
            setSuccess(response.data.message);
            setError("");
            // Clear form
            setFormData({
                username: "",
                email: "",
                password: ""
            });
            // Optionally redirect to login after a delay
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred during signup");
            setSuccess("");
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
                    Create an Account
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-500 text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <label htmlFor="username" className="block text-gray-300 font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-red-400"
                            required
                        />
                    </motion.div>

                    <motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-red-400"
                            required
                        />
                    </motion.div>

                    <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-red-400"
                            required
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg border border-red-400 hover:shadow-red-400/50 transform hover:-translate-y-1"
                        whileHover={{ scale: 1.05 }}
                    >
                        Sign Up
                    </motion.button>
                </form>

                <p className="mt-4 text-center text-gray-400">
                    Already have an account?{" "}
                    <button
                        className="text-red-400 hover:text-red-300 font-medium"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        Log In
                    </button>
                </p>
            </motion.div>
        </div>
    );
}

export default App;