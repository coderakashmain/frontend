import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Pages/Login/Login.css'

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div  className="back-button">
        <i onClick={handleBackClick} className="fa-solid fa-angle-left"></i>
        </div>
  );
};

export default BackButton;