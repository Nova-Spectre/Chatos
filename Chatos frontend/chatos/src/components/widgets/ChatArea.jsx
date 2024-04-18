// ChatArea.js

import React, { useEffect, useState } from "react";
import { setLogout } from "../../state/actions";
import { useDispatch } from "react-redux";

const dummyMessages = [
  {
    _id: 1,
    sender: "User A",
    text: "Hello!",
    timestamp: "12:35 PM",
    incoming: true,
  },
  {
    _id: 2,
    sender: "User B",
    text: "Hi there!",
    timestamp: "12:35 PM",
    incoming: false,
  },
  {
    _id: 3,
    sender: "User C",
    text: "Hey!",
    timestamp: "12:35 PM",
    incoming: true,
  },
  {
    _id: 4,
    sender: "User D",
    text: "How are you?",
    timestamp: "12:44 PM",
    incoming: false,
  },
  {
    _id: 5,
    sender: "User E",
    text: "I am fine, thanks!",
    timestamp: "12:44 PM",
    incoming: true,
  },
  {
    _id: 6,
    sender: "User F",
    text: "Good to hear!",
    timestamp: "12:44 PM",
    incoming: false,
  },
  {
    _id: 7,
    sender: "User G",
    text: "What are you doing?",
    timestamp: "12:44 PM",
    incoming: true,
  },
  {
    _id: 8,
    sender: "User H",
    text: "Just chilling.",
    timestamp: "12:44 PM",
    incoming: false,
  },
  {
    _id: 9,
    sender: "User I",
    text: "Want to hang out later?",
    timestamp: "12:44 PM",
    incoming: true,
  },
  {
    _id: 10,
    sender: "User J",
    text: "Sure, where?",
    timestamp: "12:44 PM",
    incoming: false,
  },
  {
    _id: 11,
    sender: "User K",
    text: "At the park?",
    timestamp: "12:44 PM",
    incoming: true,
  },
  {
    _id: 12,
    sender: "User L",
    text: "Sounds good!",
    timestamp: "12:44 PM",
    incoming: false,
  },
  {
    _id: 13,
    sender: "User M",
    text: "I will bring snacks.",
    timestamp: "12:44 PM",
    incoming: true,
  },
  {
    _id: 14,
    sender: "User N",
    text: "Perfect!",
    timestamp: "12:47 PM",
    incoming: false,
  },
  {
    _id: 15,
    sender: "User O",
    text: "Can I join too?",
    timestamp: "12:47 PM",
    incoming: true,
  },
  {
    _id: 16,
    sender: "User P",
    text: "Of course!",
    timestamp: "12:47 PM",
    incoming: false,
  },
  {
    _id: 17,
    sender: "User Q",
    text: "What time?",
    timestamp: "12:50 PM",
    incoming: true,
  },
];

const ChatArea = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const dispatch=useDispatch();

  useEffect(() => {
    // Simulate fetching messages when selected user changes
    if (selectedUser) {
      fetchMessages(selectedUser);
    }
  }, [selectedUser]);




  const fetchMessages = async (user) => {
    // Simulate API call to fetch messages
    // In a real application, you would make an actual API call here
    // const response = await axios.get(`/api/messages/${user._id}`);
    // setMessages(response.data);
    setMessages(dummyMessages);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p className="text-2xl">Add User to Chat</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 bg-gray-700 text-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className="rounded-full bg-gray-600 w-8 h-8 flex items-center justify-center mr-2">
            A
          </div>
          <div className="font-bold">
            {selectedUser ? selectedUser.username : "Select a User"}
          </div>
        </div>
        <div className="flex items-center">
          <button className="text-gray-100 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {/* Second SVG Button */}
          <button className="text-gray-100 focus:outline-none ml-2" onClick={() => dispatch(setLogout())}>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H5a2 2 0 00-2 2v10a2 2 0 002 2h4m-1.414-9L15 17.586M10 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <React.Fragment key={message._id}>
            {/* Render timestamp only if it's the first message or different from the previous message */}
            {(index === 0 ||
              messages[index - 1].timestamp !== message.timestamp) && (
              <div className="text-sm text-gray-500 mb-2">
                {message.timestamp}
              </div>
            )}
            <div
              className={`mb-4 ${message.incoming ? "" : "flex justify-end"}`}
            >
              <div
                className={`flex items-center ${
                  message.incoming ? "" : "flex-row-reverse"
                }`}
              >
                <div
                  className={`rounded-full bg-gray-600 w-8 h-8 flex items-center justify-center mr-2 ${
                    message.incoming ? "" : "order-last"
                  }`}
                >
                  {message.sender.charAt(0)}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    message.incoming
                      ? "bg-gray-700 text-gray-200"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* Message Input */}
      <div className="p-4 bg-gray-100 flex items-center">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2 focus:outline-none">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
