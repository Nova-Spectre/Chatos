import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { setLogin } from '../../../state/actions';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
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
      console.log("Logged in response:", loggedIn);

      if (loggedIn.message) {
        setAlertMessage(loggedIn.message);
        setOpen(true);
      } else {
        setFormData({ email: '', password: '' });
        dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setAlertMessage("An error occurred while logging in");
      setOpen(true);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <MDBContainer className="w-full h-full flex items-center justify-center">
        <MDBCard className='mx-auto' style={{ maxWidth: '600px' }}>
          <MDBCardBody className='px-10 py-12'>
            <h2 className="text-4xl text-center mb-10 font-bold text-gray-800">Login</h2>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                {alertMessage}
              </Alert>
            </Snackbar>
            <form onSubmit={handleSubmit}>
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
              <MDBBtn className='mb-6 w-full bg-green-500 text-white hover:bg-green-600 text-lg' size='lg' type='submit'>Login</MDBBtn>
            </form>
            <div className="text-center">
              <p className="text-gray-700">Don't have an account?</p>
              <button onClick={() => { navigate("/registration") }} className="text-blue-500 hover:underline text-lg">Register</button>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Login;
