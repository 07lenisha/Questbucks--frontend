import { useState } from "react";
import axios from "../Config/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/forgotpassword", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.errors || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
