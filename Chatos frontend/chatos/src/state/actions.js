

export const setUserStatus = (status) => ({
    type: 'SET_USER_STATUS',
    payload: status,
  });
  
  export const sendMessage = (message) => ({
    type: 'SEND_MESSAGE',
    payload: message,
  });

  export const registerUser = (userData) => ({
    type: 'REGISTER_USER',
    payload: userData,
  });

  export const setLogin = (userData) => ({
    type: 'SET_LOGIN',
    payload: userData,
  });

  export const setLogout = () => ({
    type: 'SET_LOGOUT',
    
  });

  export const setSelectedUser = ({ _id, username } ) => ({
    type: 'SET_SELECTED_USER',
    payload: { _id, username },
  });
  
  export const addUserToList = (user) => ({
    type: 'ADD_USER_TO_LIST',
    payload: user,
  });
  

