

import { useState } from "react";
import { isEmail } from 'validator';
import { useNavigate } from 'react-router-dom';
import { login } from "../slices/UserSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../Config/axios";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientErrors, setClientErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!isEmail(email)) {
      errors.email = 'Email is invalid';
    }

    if (password.trim().length === 0) {
      errors.password = 'Password is required';
    } else if (password.trim().length < 8 || password.trim().length > 128) {
      errors.password = 'Password should be between 8 to 128 characters';
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    try {
      const formData = { email, password };
      const response = await axios.post('/login', formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      dispatch(login(response.data));

      if (response.data.role === "company" && response.data.subscription_status !== "active") {
        navigate("/subscribe");
      } else {
        const userResponse = await axios.get("/profile", {
          headers: { Authorization: localStorage.getItem("token") }
        });

        if (!userResponse.data.isActive && userResponse.data.role !== 'admin') {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setServerErrors([{ msg: "Your account is deactivated. Please contact admin." }]);
          return;
        }

        dispatch(login(userResponse.data));
        navigate("/dashboard");
      }

    } catch (err) {
      setServerErrors(err.response?.data?.errors || [{ msg: "Login failed. Please try again." }]);
      setClientErrors({});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white text-gray-900 rounded-3xl p-9 w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>

        {serverErrors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
            <ul className="list-disc list-inside text-sm">
              {serverErrors.map((err, i) => (
                <li key={i}>{err.msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {clientErrors.email && (
              <p className="text-xs text-red-600 mt-1">{clientErrors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {clientErrors.password && (
              <p className="text-xs text-red-600 mt-1">{clientErrors.password}</p>
            )}
          </div>

          <div>
            <input
              type="submit"
              value="Login"
              className="w-full bg-blue-500 text-white hover:bg-blue-600 font-semibold py-3 rounded-md transition duration-200"
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mt-3">
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
