const initialState = {
    user: {
      userStatus: 'offline',
    },
    messages: [],
    conversations: [],
    selectedUser: null,
    userList: [],
};
  
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_STATUS':
            return {
                ...state,
                user: {
                    ...state.user,
                    userStatus: action.payload,
                },
            };
        case 'SEND_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case 'SET_LOGIN':
            return {
                ...state,
                user: action.payload.user, // accessing user data from action payload
                token: action.payload.token,
            };
        case 'SET_LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                userList: [],
                selectedUser:null,
            };
        case 'SET_SELECTED_USER':
            return {
                ...state,
                selectedUser: {
                    _id: action.payload._id,
                    username: action.payload.username,
                },
            };
        case 'ADD_USER_TO_LIST':
            return addUserToListReducer(state, action.payload);
        default:
            return state;
    }
};

const addUserToListReducer = (state, newUser) => {
    if (!state.userList) {
        // If userList is null or undefined, initialize it as an empty array
        state = {
            ...state,
            userList: [],
        };
    }
    
    // Check if the user already exists in the list
    const isDuplicate = state.userList.some(user => user._id === newUser._id);
    if (!isDuplicate) {
        return {
            ...state,
            userList: [newUser, ...state.userList],
        };
    }
    // If the user already exists, return the state without any changes
    return state;
};
  
export default rootReducer;
