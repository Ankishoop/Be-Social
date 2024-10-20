// src/components/SignupForm.jsx

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { setAuthUser } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //   toast.promise(handleSubmit, {
  //     pending: "Signing up...",
  //     success: "Signup successful! 🎉",
  //     error: "Signup failed. Please try again. 😞",
  //   });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission initiated:", formData); // Log before API call

    try {
      setLoading(true);
      console.log("Loading set to true, making API call...");
      const resp = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("🚀 ~ handleSubmit ~ resp:", resp);

      if (resp?.data?.success) {
        toast.success("User Logged in Successfully", {
          icon: "🎉",
        });
        setFormData({
          email: "",
          password: "",
        });

        dispatch(setAuthUser(resp?.data?.ExistedUser));
        navigate("/");
      }
    } catch (error) {
      console.error(
        "Error during API call:",
        error.response?.data?.message || error
      );
      toast.error(error.response?.data?.message || "Login failed", {
        icon: "😞",
      });
    } finally {
      setLoading(false);
      console.log("Finally block executed"); // Ensure this log appears
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            {loading ? (
              <button
                // type="submit"
                className="flex justify-center items-center w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <Loader2 className="animate-spin mr-2" />
                Please Wait....
              </button>
            ) : (
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Login
              </button>
            )}
          </div>

          <span className="flex items-center justify-center text-blue-800">
            <Link to={"/register"}>Create new Account</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
