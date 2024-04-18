import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import { setLogin } from '../../../state/actions';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loggedInResponse = await fetch("http://localhost:3001/chatos/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const loggedIn = await loggedInResponse.json();
      console.log("Logged in response:", loggedIn); // Log the response

      if (loggedIn.msg) {
        setAlertMessage(loggedIn.msg);
      } else {
        // Reset form fields
        setFormData({
          email: '',
          password: ''
        });

        // Dispatch login action
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );

        // Navigate to home page
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setAlertMessage("An error occurred while logging in");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex items-center justify-center">
      <MDBContainer>
        <MDBCard className='mx-auto' style={{maxWidth: '400px'}}>
          <MDBCardBody className='px-5 py-8'>
            <h2 className="text-3xl text-center mb-8 font-bold text-white">Login</h2>
            {alertMessage && <div className="alert alert-danger">{alertMessage}</div>}
            <form onSubmit={handleSubmit}>
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
              <MDBBtn className='mb-4 w-full bg-white text-black' size='lg' type='submit'>Login</MDBBtn>
            </form>

            <div><button onClick={()=>{navigate("/registration")}}>Register page</button></div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Login;
