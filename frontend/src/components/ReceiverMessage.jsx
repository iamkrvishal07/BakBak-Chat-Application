import React, { useEffect, useRef } from 'react';
import dp from "../assets/dp.webp";
import { useSelector } from 'react-redux';

function ReceiverMessage({ image, message }) {
  const scroll = useRef();
  const { selectedUser } = useSelector(state => state.user);

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className='flex items-start gap-3 px-2'>
      {/* Avatar */}
      <div className='w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/30 shadow-lg'>
        <img src={selectedUser.image || dp} alt="User" className='w-full h-full object-cover' />
      </div>

      {/* Message Bubble */}
      <div
        ref={scroll}
        className='max-w-[75%] px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm rounded-2xl rounded-tl-none shadow-md flex flex-col gap-2'
      >
        {image && (
          <img
            src={image}
            alt="img"
            className='w-[160px] rounded-lg border border-white/10 shadow'
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
}

export default ReceiverMessage;
