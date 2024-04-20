import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addUserToList } from "../../state/actions";

const ChatList = ({ selectedUser, onSelectUser, loggedUser }) => {
  //   const token = useSelector((state) => state.token);
  const [conversationIds, setConversationIds] = useState([]);
  const [memberUsernames, setMemberUsernames] = useState({});
  const [fetchedMemberIds, setFetchedMemberIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const userList = useSelector((state) => state.userList);
  const dispatch = useDispatch();

  const [fetchMemberCount, setFetchMemberCount] = useState(0);
  const [fetchConversationCount, setFetchConversationCount] = useState(0);
  const { _id } = selectedUser;

  console.log("chatlist userList", userList);

  useEffect(() => {
    const fetchConversationId = async () => {
      try {
        setFetchConversationCount(fetchConversationCount + 1);
        // Make a request to your backend API to fetch the conversation ID for the current user
        const response = await axios.get(
          `http://localhost:3001/chatos/users/${loggedUser}`
        );
        const user = response.data;
        // Assuming user has a field to store the conversation ID
        const userConversationId = user.conversationIds;
        // console.log("Fetched conversation ID:", userConversationId);
        setConversationIds(userConversationId);
      } catch (error) {
        console.error("Error fetching conversation ID:", error);
      }
    };

    // Call fetchConversationId when loggedUser changes
    if (userList.length === 0) {
      fetchConversationId();
      // console.log("Fetching conversation IDs...");
    }
  }, [loggedUser, userList, fetchConversationCount]);

  useEffect(() => {
    const fetchMemberUsernames = async () => {
      try {
        setFetchMemberCount(fetchMemberCount + 1);
        const fetchedIds = [];
        for (const conversationId of conversationIds) {
          const response = await axios.get(
            `http://localhost:3001/chatos/conversations/${conversationId}`
          );
          const members = response.data.members;
          // console.log(
          //   `Fetched members for conversation ${conversationId}:`,
          //   members
          // );
          const usernames = {};
          for (const memberId of members) {
            const userResponse = await axios.get(
              `http://localhost:3001/chatos/users/${memberId}`
            );
            fetchedIds.push(memberId);
            const username = userResponse.data.username;
            // console.log(`Fetched username for member ${memberId}:`, username);
            usernames[memberId] = username;
          }
          setMemberUsernames((prevUsernames) => ({
            ...prevUsernames,
            [conversationId]: usernames,
          }));
          setLoading(false);
          Object.keys(usernames).forEach((userId) => {
            const payload = { _id: userId, username: usernames[userId] };
            // console.log(
            //   "Dispatching addUserToList action with payload:",
            //   payload
            // );
            dispatch(addUserToList(payload));
          });
          setFetchedMemberIds(fetchedIds);
        }
      } catch (error) {
        console.error("Error fetching member usernames:", error);
      }
    };

    if (conversationIds.length > 0 && fetchMemberCount === 0) {
      fetchMemberUsernames();
    }
  }, [conversationIds, dispatch, fetchMemberCount]);

  // console.log("ConversationCount :", fetchConversationCount);
  // console.log("MemberCount :", fetchMemberCount);
  // console.log("MemebersIDD : 0",fetchedMemberIds);

  const addUserToConversation = async (userId) => {
    try {
      console.log("memberIDs", fetchedMemberIds);
      console.log(`userId`, userId);
      userId = String(userId);
      const isUserAlreadyAdded = userList.some((user) => user._id === _id);
      console.log("isUserAlreadyAdded:", isUserAlreadyAdded);

      if (fetchedMemberIds.includes(userId) || isUserAlreadyAdded) {
        console.log("User is already added to the conversation");
        return;
      }

      console.log("Adding user to the conversation...");
      const response = await axios.post(
        "http://localhost:3001/chatos/add-users",
        { memberId: userId, senderId: loggedUser }
      );
      console.log("User added to conversation:", response.data);

      // Implement logic to update the user list if needed
    } catch (error) {
      console.error("Error adding user to conversation:", error);
      console.log(error);
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex-1 overflow-y-auto">
      {userList.map((user) => (
        <div
          key={user._id}
          className={`p-4 border-b border-gray-700 cursor-pointer ${
            selectedUser && selectedUser._id === user._id
              ? "bg-gray-900 text-white"
              : "bg-gray-700 text-gray-50"
          }`}
          onClick={() => {
            onSelectUser(user);
            addUserToConversation(user._id);
          }}
        >
          {user.username}
        </div>
      ))}
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
