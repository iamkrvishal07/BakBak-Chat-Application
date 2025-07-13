import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

function MessageArea() {
  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const image = useRef();
  const typingTimeout = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim().length === 0 && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessages([
        ...(Array.isArray(messages) ? messages : []),
        result.data
      ]));

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);

      socket?.emit("stopTyping", {
        senderId: userData._id,
        receiverId: selectedUser._id
      });

    } catch (error) {
      console.log(error);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setInput(value);

    socket?.emit("typing", {
      senderId: userData._id,
      receiverId: selectedUser._id
    });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket?.emit("stopTyping", {
        senderId: userData._id,
        receiverId: selectedUser._id
      });
    }, 2000);
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  // Clear messages on user switch
  useEffect(() => {
    if (selectedUser) {
      dispatch(setMessages([]));
    }
  }, [selectedUser, dispatch]);

  // Fetch chat history when user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        const res = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
          withCredentials: true,
        });

        dispatch(setMessages(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  //  Socket Events
  useEffect(() => {
    const handleNewMessage = (msg) => {
      dispatch(setMessages([
        ...(Array.isArray(messages) ? messages : []),
        msg
      ]));
    };

    socket?.on("newMessage", handleNewMessage);

    socket?.on("typing", ({ senderId }) => {
      if (senderId === selectedUser?._id && senderId !== userData._id) {
        setIsTyping(true);
      }
    });

    socket?.on("stopTyping", ({ senderId }) => {
      if (senderId === selectedUser?._id && senderId !== userData._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("typing");
      socket?.off("stopTyping");
    };
  }, [socket, messages, selectedUser, userData._id, dispatch]);

  return (
    <div className={`lg:w-[70%] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-[#1e1e2f] overflow-hidden`}>
      {selectedUser ? (
        <div className="w-full h-full flex flex-col overflow-hidden px-4">
          {/* Top Bar */}
          <div className="w-full h-[100px] bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] rounded-b-[30px] shadow-lg flex items-center px-6 gap-4">
            <div className="cursor-pointer" onClick={() => dispatch(setSelectedUser(null))}>
              <IoIosArrowRoundBack className="w-8 h-8 text-white" />
            </div>
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-white shadow-md">
              <img src={selectedUser.image || dp} alt="" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-white font-semibold text-lg">
              {selectedUser?.name || "User"}
            </h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-4">
            {showPicker && (
              <div className="absolute bottom-[120px] left-4 z-[100]">
                <EmojiPicker width={250} height={350} onEmojiClick={onEmojiClick} />
              </div>
            )}

            {Array.isArray(messages) &&
              messages.map((msg, i) =>
                msg.sender === userData._id ? (
                  <SenderMessage key={i} image={msg.image} message={msg.message} />
                ) : (
                  <ReceiverMessage key={i} image={msg.image} message={msg.message} />
                )
              )}

            {isTyping && (
              <p className="text-violet-300 italic text-sm animate-pulse ml-2">
                {selectedUser?.name || "User"} is typing...
              </p>
            )}
          </div>

          {/* Image Preview */}
          {frontendImage && (
            <img
              src={frontendImage}
              alt="Preview"
              className="w-[70px] h-[70px] object-cover absolute bottom-[100px] right-[20%] rounded-md shadow-md"
            />
          )}

          {/* Input Bar */}
          <div className="w-full flex items-center justify-center pb-4">
            <form
              className="w-full max-w-[700px] h-[58px] bg-white/5 backdrop-blur-lg border border-white/10 rounded-full flex items-center px-4 gap-4 shadow-md"
              onSubmit={handleSendMessage}
            >
              <RiEmojiStickerLine
                className="w-6 h-6 text-[#a29bfe] cursor-pointer"
                onClick={() => setShowPicker((prev) => !prev)}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                ref={image}
                onChange={handleImage}
              />
              <input
                type="text"
                placeholder="Message"
                className="flex-1 bg-transparent text-white placeholder:text-violet-300 outline-none text-sm"
                value={input}
                onChange={handleTyping}
              />
              <FaImages
                className="w-5 h-5 text-[#a29bfe] cursor-pointer"
                onClick={() => image.current.click()}
              />
              {(input.length > 0 || backendImage !== null) && (
                <button type="submit">
                  <RiSendPlane2Fill className="w-6 h-6 text-[#a29bfe]" />
                </button>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#1e1e2f] text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome to Bak-Bak</h1>
          <p className="text-xl text-violet-300">Chat Friendly!</p>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
