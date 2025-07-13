import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dp from "../assets/dp.webp";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { serverUrl } from '../main';
import axios from 'axios';
import { toast } from 'react-toastify';

import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData
} from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user);
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.log(error)
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true });
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  useEffect(() => {
    if (input.trim()) handleSearch();
  }, [input]);

  return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-[#1e1e2f] relative ${!selectedUser ? "block" : "hidden"}`}>

      {/* 🔍 Search Results Dropdown */}
      {input.length > 0 && (
        <div className='absolute top-[200px] bg-white/10 backdrop-blur-md border border-white/10 w-full h-[calc(100%-200px)] overflow-y-auto flex flex-col gap-3 z-[150] shadow-xl rounded-t-xl p-2'>
          {searchData?.map(user => (
            <div
              key={user._id}
              className='w-[95%] mx-auto h-[70px] flex items-center gap-4 px-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 cursor-pointer transition'
              onClick={() => {
                dispatch(setSelectedUser(user));
                setInput("");
                setSearch(false);
              }}
            >
              <div className='relative w-[60px] h-[60px] rounded-full overflow-hidden'>
                <img src={user.image || dp} alt="User" className='w-full h-full object-cover' />
                {onlineUsers?.includes(user._id) && (
                  <span className='absolute bottom-[4px] right-[4px] w-[12px] h-[12px] bg-green-400 rounded-full border-2 border-[#1e1e2f]' />
                )}
              </div>
              <h1 className='text-white font-medium text-base'>{user.name || user.userName}</h1>
            </div>
          ))}
        </div>
      )}

      {/* 💡 Header */}
      <div className='w-full h-[250px] bg-gradient-to-tr from-[#6c5ce7] to-[#a29bfe] rounded-b-[15%] shadow-lg flex flex-col justify-center px-6 text-white'>
        <div className='flex justify-between items-center mt-3'>
          <h1 className='text-white font-semibold text-xl'>Welcome, {userData.name || "User"}</h1>
          <div className='flex items-center gap-3'>
            <div
              onClick={() => navigate("/profile")}
              className='w-[55px] h-[55px] bg-white/20 border border-white/30 rounded-full overflow-hidden shadow-md cursor-pointer transition hover:scale-105'
            >
              <img src={userData.image || dp} alt="Me" className='w-full h-full object-cover' />
            </div>

            <div
              onClick={handleLogOut}
              className='w-[55px] h-[55px] bg-red-800 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md hover:bg-red-600 transition'
            >

              
              <BiLogOutCircle className='w-6 h-6' />
            </div>
          </div>
        </div>

        {/*  Search Bar */}
        <div className='mt-4'>
          {!search ? (
            <div
              className='w-[50px] h-[50px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer shadow-md'
              onClick={() => setSearch(true)}
            >
              <IoIosSearch className='text-white w-6 h-6' />
            </div>
          ) : (
            <form className='w-full flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full shadow-md'>
              <IoIosSearch className='text-white/80 w-5 h-5' />
              <input
                type="text"
                placeholder='Search users...'
                className='flex-1 bg-transparent text-sm text-white placeholder:text-violet-200 outline-none'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <RxCross2 className='w-5 h-5 text-white/60 cursor-pointer' onClick={() => { setSearch(false); setInput(""); }} />
            </form>
          )}
        </div>

        {/* Online Users List (Horizontal) */}
        {!search && (
          <div className='mt-4 overflow-x-auto px-2'>
            <div className='flex items-center gap-4'>
              {otherUsers?.map(user => (
                onlineUsers?.includes(user._id) && (
                  <div
                    key={user._id}
                    className='relative w-[55px] h-[55px] bg-white/10 border border-white/20 rounded-full overflow-hidden shadow-md cursor-pointer hover:scale-105 transition'
                    onClick={() => dispatch(setSelectedUser(user))}
                  >
                    <img
                      src={user.image || dp}
                      alt="User"
                      className='w-full h-full object-cover rounded-full'
                    />
                    <span className='absolute bottom-[2px] right-[5px] w-[12px] h-[12px] bg-green-400 rounded-full border-2 border-[#1e1e2f] shadow' />
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* All Users List (Vertical) */}
      <div className='w-full h-[60%] overflow-y-auto mt-5 flex flex-col gap-4 px-4 pb-4'>
        {otherUsers?.map(user => (
          <div
            key={user._id}
            className='w-full h-[60px] bg-white/10 border border-white/10 flex items-center gap-4 px-4 rounded-full shadow hover:bg-white/20 cursor-pointer transition backdrop-blur-sm'
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className='relative w-[50px] h-[50px]'>
              <img src={user.image || dp} alt="User" className='rounded-full w-full h-full object-cover' />
              {onlineUsers?.includes(user._id) && (
                <span className='absolute bottom-[4px] right-[4px] w-[10px] h-[10px] bg-green-400 rounded-full border-2 border-[#1e1e2f]' />
              )}
            </div>
            <h1 className='text-white font-medium text-base'>{user.name || user.userName}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
