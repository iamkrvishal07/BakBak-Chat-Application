# BakBak

**Bak-Bak** is a real-time chat application with a sleek glassmorphic UI. It supports one-on-one messaging, emoji reactions, image sharing, online status display, and live typing indicators. Built using the MERN stack and Socket.IO, Bak-Bak delivers smooth and secure real-time conversations with modern design.

## Tech Stack

**Frontend:** React, Redux Toolkit, Tailwind CSS, Axios, Socket.IO Client  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, Socket.IO 

## Features
 Secure login and JWT-based authentication  
 Real-time messaging using Socket.IO  
 Live typing indicator with debounce  
 Online/offline user status tracking  
 Image upload support via Cloudinary  
 Emoji picker for expressive messaging  
 Search bar to filter users or conversations  
 Clean and responsive dark glassmorphic UI  
 Redux Toolkit for global state management

 ## Screenshots
  
Login Page – User login using email and password  
<img width="1513" height="845" alt="Image" src="https://github.com/user-attachments/assets/857e1b97-dc12-43e0-955f-d41dd9ef316e" />


**Profile Page** – Shows logged-in user’s details
<img width="1359" height="755" alt="Image" src="https://github.com/user-attachments/assets/05007a94-9d89-4620-bff2-58f040670da4" />


**Home Page** – Displays all users with search functionality
<img width="1359" height="830" alt="Image" src="https://github.com/user-attachments/assets/6ff1fed0-e45e-4d69-b208-0e1a51cddbbc" />


**Chat Page** – One-to-one chat with emojis, images, typing
![Image](https://github.com/user-attachments/assets/7019c255-0cbd-43fa-b68d-f9a7becd81a4)
<img width="1867" height="893" alt="Image" src="https://github.com/user-attachments/assets/fe55392a-704a-4983-aa92-8c5acdafe597" />


## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bakbak.git
cd bakbak
----------------
cd backend
npm install
npm run server
---------------
cd ../frontend
npm install
npm start
```

## Challenges Faced

**Typing Indicator**:  
Used debounce with `setTimeout` to emit `typing` and `stopTyping` events without flooding the server.

**Socket Management**:  
Maintained a `userId -> socketId` map to emit events to specific users.

**Disconnect Handling**:  
Cleaned up socket data on disconnect and updated online users globally.



