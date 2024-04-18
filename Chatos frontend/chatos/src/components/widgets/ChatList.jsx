import React,{useEffect,useState} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatList = ({ selectedUser, onSelectUser ,loggedUser }) => {
//   const token = useSelector((state) => state.token);
const [conversationIds, setConversationIds] = useState([]);
const [memberUsernames, setMemberUsernames] = useState({});
const [loading, setLoading] = useState(true);
const userList = useSelector((state) => state.userList);

useEffect(() => {
  const fetchConversationId = async () => {
    try {
      // Make a request to your backend API to fetch the conversation ID for the current user
      const response = await axios.get(`http://localhost:3001/chatos/users/${loggedUser}`);
      const user = response.data;
      // Assuming user has a field to store the conversation ID
      const userConversationId = user.conversationIds;
      console.log("Fetched conversation ID:", userConversationId);
      setConversationIds(userConversationId);
    } catch (error) {
      console.error("Error fetching conversation ID:", error);
    }
  };

  // Call fetchConversationId when loggedUser changes
  if (loggedUser) {
    fetchConversationId();
    console.log("Logged user changed, fetching conversation ID...");
  }
}, [loggedUser]);

useEffect(() => {
  const fetchMemberUsernames = async () => {
    try {
      for (const conversationId of conversationIds) {
        const response = await axios.get(
          `http://localhost:3001/chatos/conversations/${conversationId}`
        );
        const members = response.data.members;
        console.log(`Fetched members for conversation ${conversationId}:`, members);
        const usernames = {};
        for (const memberId of members) {
          const userResponse = await axios.get(
            `http://localhost:3001/chatos/users/${memberId}`
          );
          const username = userResponse.data.username;
          console.log(`Fetched username for member ${memberId}:`, username);
          usernames[memberId] = username;
        }
        setMemberUsernames(prevUsernames => ({
          ...prevUsernames,
          [conversationId]: usernames
        }));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching member usernames:", error);
    }
  };

  if (conversationIds.length > 0) {
    fetchMemberUsernames();
  }
}, [conversationIds]);



  // const addUserToConversation = async (userId) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3001/chatos/add-users",
  //       { memberId:userId,senderId:loggedUser},
  //     );
  //     console.log("User added to conversation:", response.data);
  //     // Implement logic to update the user list if needed
  //   } catch (error) {
  //     console.error("Error adding user to conversation:", error);
  //     console.log(error);
  //   }
  // };

  // const addUserToConversation = async (conversationId, username) => {
  //   try {
  //     const userId = Object.keys(memberUsernames[conversationId]).find(
  //       (key) => memberUsernames[conversationId][key] === username
  //     );
  //     const response = await axios.post(
  //       "http://localhost:3001/chatos/add-users",
  //       { memberId: userId, senderId: loggedUser }
  //     );
  //     console.log("User added to conversation:", response.data);
  //     // Implement logic to update the user list if needed
  //   } catch (error) {
  //     console.error("Error adding user to conversation:", error);
  //   }
  // };


  if (loading) {
    return <div>Loading...</div>;
  }

  

  return(
    <div className="flex-1 overflow-y-auto">
      {Object.keys(memberUsernames).map((conversationId) =>
        Object.values(memberUsernames[conversationId]).map((username, index) => (
          <div
            key={`${conversationId}-${index}`}
            className={`p-4 border-b border-gray-700 cursor-pointer ${
              selectedUser && selectedUser._id === username
                ? "bg-gray-900 text-white"
                : "bg-gray-700 text-gray-50"
            }`}
            onClick={() => {
              onSelectUser(username);
              // addUserToConversation(conversationId, username);
            }}
          >
            {username}
          </div>
        ))
      )}
    </div>
  );
};

ChatList.propTypes = {
  // Add validation for userList
  selectedUser: PropTypes.object.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  loggedUser: PropTypes.string.isRequired,
};



export default ChatList;
