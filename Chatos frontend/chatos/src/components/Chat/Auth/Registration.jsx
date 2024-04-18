import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import {useNavigate} from "react-router-dom";// Import useNavigate for navigation
import { registerUser } from '../../../state/actions.js'; // Import registerUser action

function Registration() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Get navigate object for navigation
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert email to lowercase if the input field is for email
    const lowercasedValue = name === 'email' ? value.toLowerCase() : value;

    setFormData({
      ...formData,
      [name]: lowercasedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const savedUserResponse = await fetch(
        "http://localhost:3001/chatos/register",
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!savedUserResponse.ok) {
        throw new Error('Failed to register user');
      }

      // Navigate to the login page after successful registration
      navigate('/login');

      // Optionally display a Snackbar notification for registration completion
      // Note: Implementing a Snackbar component depends on the library you're using
      // You can use Material-UI Snackbar or any other similar library
      alert('Registration completed successfully');

      const savedUser = await savedUserResponse.json();
      // Optionally dispatch an action with the saved user data
      // dispatch(registerUser(savedUser));
      console.log("User registered successfully:", savedUser);
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex items-center justify-center">
      <MDBContainer>
        <MDBCard className='mx-auto' style={{maxWidth: '400px'}}>
          <MDBCardBody className='px-5 py-8'>
            <h2 className="text-3xl text-center mb-8 font-bold text-white">Create an account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="text-white">Your Name</label>
                <MDBInput
                  id='username'
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="rounded-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="text-white">Your Email</label>
                <MDBInput
                  id='email'
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="text-white">Password</label>
                <MDBInput
                  id='password'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="rounded-full"
                />
              </div>
              <MDBBtn className='mb-4 w-full bg-white text-black' size='lg' type='submit'>Register</MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Registration;
