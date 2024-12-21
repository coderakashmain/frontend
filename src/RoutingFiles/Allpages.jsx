import React, {Suspense, useEffect, useState}  from 'react'
import { Outlet } from 'react-router-dom'
import Loadingicon from '../Component/Jsonlicon/Loadingicon'
import ReCaptha from '../Component/Captha/ReCaptha'
import Navbar from '../Component/Navbar/Navbar'





const Allpages = (props) => {

  const [isVerified, setIsVerified] = useState(false); // Track verification status

  const handleVerification = (status) => {
    setIsVerified(status); // Update state after successful verification
  };

 
  return (

    <>
    {!isVerified ? (
      // Show ReCaptcha until user is verified
      <ReCaptha onVerified={handleVerification} />
    ) : (
      // Load the main application once verified
      <Suspense fallback={<Loadingicon />}>
        <Navbar showAlart={props.showAlart}/>
        <Outlet />
      </Suspense>
    )}
  </>
  )
}

export default Allpages
