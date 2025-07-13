import React, { useRef, useState } from "react";
import dp from "../assets/dp.webp";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData.name || "");
  const [frontendImage, setFrontendImage] = useState(userData.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const image = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("Profile updated successfully 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#1e1e2f] flex flex-col justify-center items-center px-4">
      {/* Back Button */}
      <div
        className="fixed top-5 left-5 cursor-pointer text-white/80 hover:text-white"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack className="w-10 h-10" />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-[460px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.3)] p-6 flex flex-col items-center gap-6">

        {/* Profile Image Picker */}
        <div
          className="relative cursor-pointer"
          onClick={() => image.current.click()}
        >
          <div className="w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-violet-400 shadow-xl">
            <img src={frontendImage} alt="profile" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center shadow-md text-white">
            <IoCameraOutline className="w-5 h-5" />
          </div>
        </div>

        <form
          onSubmit={handleProfile}
          className="w-full flex flex-col gap-5 items-center"
        >
          <input
            type="file"
            accept="image/*"
            hidden
            ref={image}
            onChange={handleImage}
          />

          {/* Name */}
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full h-[48px] px-5 py-2 rounded-2xl bg-white/10 border border-violet-300 text-white placeholder:text-violet-200 text-base outline-none focus:ring-2 focus:ring-[#a29bfe]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Username (Read-only) */}
          <input
            type="text"
            readOnly
            className="w-full h-[48px] px-5 py-2 rounded-2xl bg-white/10 border border-white/20 text-gray-400 text-base outline-none"
            value={userData?.userName}
          />

          {/* Email (Read-only) */}
          <input
            type="email"
            readOnly
            className="w-full h-[48px] px-5 py-2 rounded-2xl bg-white/10 border border-white/20 text-gray-400 text-base outline-none"
            value={userData?.email}
          />

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-[180px] mt-1 py-2 bg-gradient-to-tr from-[#7d5fff] to-[#a29bfe] text-white text-base font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-200"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
