import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
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

  useEffect(() => {
    console.log('UserList :   ',userList); // Check if userList is being populated correctly
  }, [userList]);


  // const handleUserSelect = (selectedUser) => {
  //   console.log("Selected User:", selectedUser);
  
  //   // Check if selectedUser exists and has _id and username defined
  //   if (selectedUser._id && selectedUser.username) {
  //     const { _id, username } = selectedUser;
  
  //     const isUserAlreadyAdded = userList.some(user => user._id === _id);
  //     console.log('Already Existing User');
  
  //     // Dispatch an action to add the selected user to the userList
  //     if (!isUserAlreadyAdded) {
  //       dispatch(addUserToList({ _id, username }));
  //       console.log(`Dispatching to UserList:`, _id, username);
  //     }
  //     console.log(`Dispatching SelectedUser`);
  //     dispatch(setSelectedUser(selectedUser));
  //   } else {
  //     console.log("Selected user is null or missing _id/username, skipping dispatch.");
  //   }
  // };

  const handleUserSelect = (selectedUser) => {
    console.log("Selected User:", selectedUser);
  
    // Check if selectedUser exists and has _id and username defined
    if (selectedUser._id && selectedUser.username) {
      const { _id, username } = selectedUser;
  
      const isUserAlreadyAdded = userList.some(user => user._id === _id);
      console.log('Already Existing User');
  
      // Dispatch an action to add the selected user to the userList
      if (!isUserAlreadyAdded) {
        dispatch(addUserToList({ _id, username }));
        console.log(`User added successfully to the list:`, _id, username);
      } else {
        console.log(`User already exists in the list:`, _id, username);
      }
    } else {
      console.log("Selected user is null or missing _id/username, skipping addUserToList dispatch.");
    }
  
    console.log(`Dispatching setSelectedUser`);
    dispatch(setSelectedUser(selectedUser));
};

  
  
  

  






  
  

  

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-gray-100 flex flex-col">
        {/* Search Bar */}
        <div className="p-4">
          <SearchBar onUserSelect={handleUserSelect} loggedUser={_id} />
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
