import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import { registerUser } from '../../../state/actions.js';

function Registration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
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

      navigate('/login');
      alert('Registration completed successfully');

      const savedUser = await savedUserResponse.json();
      console.log("User registered successfully:", savedUser);
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <MDBContainer>
        <MDBCard className='mx-auto' style={{ maxWidth: '600px' }}>
          <MDBCardBody className='px-10 py-12'>
            <h2 className="text-4xl text-center mb-10 font-bold text-gray-800">Create an account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="username" className="text-gray-800">Username</label>
                <MDBInput
                  id='username'
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="rounded-full py-3 px-3 text-lg"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="text-gray-800">Your Email</label>
                <MDBInput
                  id='email'
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-full py-3 px-4 text-lg"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="text-gray-800">Password</label>
                <MDBInput
                  id='password'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="rounded-full py-3 px-4 text-lg"
                />
              </div>
              <MDBBtn className='mb-6 w-full bg-green-500 text-white hover:bg-green-600 text-lg' size='lg' type='submit'>Register</MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Registration;
