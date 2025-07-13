import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";
import { toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(res.data));
      navigate("/profile");
      toast.success("Account created successfully 🎉");
      setUserName("");
      setEmail("");
      setPassword("");
      setErrMsg("");
    } catch (error) {
      setErrMsg(error?.response?.data?.message || "Signup failed");
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#1e1e2f]">
      <div className="w-full max-w-[420px] h-[580px] bg-white/5 backdrop-blur-[6px] border border-white/10 rounded-3xl shadow-[0_8px_24px_0_rgba(0,0,0,0.3)] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="h-[180px] bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] rounded-b-[35%] flex items-center justify-center shadow-lg">
          <h1 className="text-white font-extrabold text-3xl drop-shadow-sm">
            Let’s Bak-Bak ✨
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignUp}
          className="flex flex-col items-center px-6 pt-8 gap-5"
        >
          <input
            type="text"
            placeholder="Username"
            className="w-full h-[48px] px-5 py-2 rounded-2xl bg-white/10 border border-[#8e8ee7]/30 text-white placeholder:text-violet-200 text-base outline-none focus:ring-2 focus:ring-[#a29bfe]"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full h-[48px] px-5 py-2 rounded-2xl bg-white/10 border border-[#8e8ee7]/30 text-white placeholder:text-violet-200 text-base outline-none focus:ring-2 focus:ring-[#a29bfe]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="w-full h-[48px] px-5 py-2 rounded-2xl bg-white/10 border border-[#8e8ee7]/30 text-white flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent text-white text-base outline-none placeholder:text-violet-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-4 top-[10px] text-sm text-violet-300 hover:text-white cursor-pointer select-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {errMsg && <p className="text-red-400 text-sm">* {errMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-[180px] mt-3 py-2 bg-gradient-to-tr from-[#7d5fff] to-[#a29bfe] text-white text-base font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-200"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-sm mt-2 text-violet-300">
            Already have an account?{" "}
            <span
              className="text-[#a29bfe] font-semibold hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
