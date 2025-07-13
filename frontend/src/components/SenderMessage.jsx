import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function SenderMessage({ image, message }) {
  const scroll = useRef();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-start gap-3 px-2 justify-end">
      {/* Message Bubble */}
      <div
        ref={scroll}
        className="max-w-[75%] px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm rounded-2xl rounded-tr-none shadow-md flex flex-col gap-2 ml-auto"
      >
        {image && (
          <img
            src={image}
            alt="sent"
            className="w-[160px] rounded-lg border border-white/10 shadow"
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/30 shadow-lg">
        <img src={userData.image || dp} alt="Me" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default SenderMessage;
