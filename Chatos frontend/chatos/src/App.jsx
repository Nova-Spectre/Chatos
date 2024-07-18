import React from 'react';
import { BrowserRouter , Navigate , Routes , Route  } from 'react-router-dom';
import './App.css';
import Registration from './components/Chat/Auth/Registration';
import Login from './components/Chat/Auth/Login';
import { Home } from './components/Chat/Home/index';
import { useSelector } from 'react-redux';
 // Assuming you have a Home component

function App() {

  const isAuth=Boolean(useSelector((state)=>state.token));

  return (
    
      <div className="App">
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/registration" element={<Registration/>} />
          {/* Add more routes as needed */}
          <Route path="/home" element={isAuth?<Home/>:<Navigate to="/"></Navigate>} />
          {/* Default route */}
          <Route path="*" element={NotFound} />
          </Routes>
        </BrowserRouter>
      </div>

  );
}

// NotFound component for handling 404 errors
const NotFound = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
    </div>
  );
};

export default App;
