import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatArea from "../../widgets/ChatArea";
import ChatList from "../../widgets/ChatList";
import SearchBar from "../../widgets/SearchBar";
import { setSelectedUser, addUserToList } from "../../../state/actions";
import axios from "axios";

export const Home = () => {
  // Remove duplicated declaration of selectedUser
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser);
  const userList = useSelector((state) => state.userList);
  const _id = useSelector((state) => state.user._id);
  console.log(_id);


  const handleUserSelect = (selectedUser) => {
    dispatch(setSelectedUser(selectedUser));
    dispatch(addUserToList(selectedUser));
  
  };

  


 

 




  
  

  

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-gray-100 flex flex-col">
        {/* Search Bar */}
        <div className="p-4">
          <SearchBar onUserSelect={handleUserSelect} />
        </div>
        {/* Chat List */}
        <ChatList 
          selectedUser={selectedUser}
          onSelectUser={handleUserSelect}
          loggedUser={_id} 
        />
      </div>
      {/* Chat Area */}
      <ChatArea selectedUser={selectedUser} />
    </div>
  );
};
