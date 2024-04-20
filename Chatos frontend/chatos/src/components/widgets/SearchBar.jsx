import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SearchBar = ({ onUserSelect , loggedUser }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Adjust the debounce delay as needed (e.g., 500ms)

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/chatos/users/search?query=${debouncedQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        
        // Filter out the logged-in user from the suggestions
        const filteredSuggestions = response.data.filter(user => user._id !== loggedUser);

        setSuggestions(filteredSuggestions);
        console.log(filteredSuggestions);
      } catch (error) {
        console.error(error);
      }
    };

    if (debouncedQuery) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, token, loggedUser]); // Added loggedUser to the dependency array

  
  const handleSelect = (selectedUser) => {
    // Pass the selected user to the parent component
    const formattedUser = { _id: selectedUser._id, username: selectedUser.username };
    onUserSelect(formattedUser);
    console.log(`Searchbar`,selectedUser._id,selectedUser.username);
  
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for users..."
        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:bg-gray-600"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul className="absolute left-0 right-0 bg-black mt-1 rounded-lg shadow-lg">
        {suggestions.map((user) => (
          <li
            key={user._id}
            className="px-4 py-2 cursor-pointer hover:bg-gray-800  border border-gray-700"
            onClick={() => handleSelect(user)}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
