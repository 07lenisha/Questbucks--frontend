
import { useState } from "react";
import axios from "../Config/axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/resetpassword", { token, newPassword });
      setMessage(res.data.message);

      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Reset
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
