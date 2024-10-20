// src/components/SignupForm.jsx

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  //   const isLoggedIn = ;

  //   useEffect(() => {

  //   }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here, you can handle the form submission logic (e.g., send data to a server);
    console.log("Form submitted:", formData);

    try {
      setLoading(true);
      const resp = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(resp.data);
      if (resp?.data?.success) {
        toast.success("User Register SuccessFully", {
          icon: "🎉",
        });
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      }
      console.log("🚀 ~ handleSubmit ~ resp:", resp);

      if (resp.data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message, {
        icon: "😞",
      });
    } finally {
      setLoading(false);
      console.log("here");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John Doe"
            />
          </div>

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
                Sign Up
              </button>
            )}
          </div>
        </form>
        <span className="flex items-center justify-center text-blue-800">
          <Link to={"/login"}>Already have Account</Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
