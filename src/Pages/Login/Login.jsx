import React, { useContext, useEffect, useRef, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../Component/Backbutton/Backbutton";
import { UserContext } from "../../Context/UserContext/UserContextdata";




const Login = (props) => {

  const {setUsernav} = useContext(UserContext);
  const [repeatclick,setRepeatclick] =useState(false);
  const [loginData, setLoginData] = useState({
    gmail : '',
    password : ''
  });

  const navigate = useNavigate();

  const loginChange = (e)=>{
    const {name,value} = e.target;
    setLoginData((predata)=>({
      ...predata,
      [name] : value
    }));
  };
    const loginSubmit =async (e)=>{
      setRepeatclick(true);
      e.preventDefault();
      try{
        const response = await axios.post('/api/LogIn', loginData, { withCredentials: true });
        if(response.status === 200 ){
          setUsernav(response.data.user);
          navigate('/');
          props.showAlart('Log in Successfull.','','check');
          setRepeatclick(false);
        }
       
        else {
          console.error('Error retrieving data');
          props.showAlart('Error retrieving data');
          setRepeatclick(false);
          
        }


       } catch(error){
        if(error.response && error.response.status === 401){
          props.showAlart('Invalid credentials','try again','cancel');
          setRepeatclick(false);
        }
        if(error.response && error.response.status === 500){
          props.showAlart('Internal Server Error','','cancel');
          setRepeatclick(false);
        }
        setRepeatclick(false);
       }
    };

    const submitRef  = useRef();

    useEffect(()=>{
      if(repeatclick){
        submitRef.current.style.opacity = '0.5';
      }
      else{
        submitRef.current.style.opacity = '1';
      }
    },[repeatclick])
 
  return (
    <>
      <div className="main-login-container ">
        <BackButton/>
        <div className="inner-main-login ">
          <form action="/api/LogIn" method="post" onSubmit={loginSubmit}>
            <h2 className="main-heading" >Hello</h2>
            <h4 className="main-sub-heading">Login your accounts.......!</h4>
            <h3 className="">Email :-</h3>
            <input type="email" onChange={loginChange} value={loginData.gmail} name="gmail" id="loginemial" placeholder=""  required/>
            <h3 className="">Password :-</h3>
            <input  type="password" onChange={loginChange} autoComplete="off" value={loginData.password} name="password" id="loginpassword" placeholder="" />
            <div className="remember-forget-parent">
              <p className="">
                <input type="checkbox" name="logincheckbox" id="" className="mr-2" defaultChecked />
               &nbsp; Remember me
              </p>
              <Link to='ForgatePw' style={{color : '#4B97D5'} } >Forget password ?</Link>
            </div>
            <div className="submit-parant">
              <input ref={submitRef} disabled={repeatclick} type="submit" value="Login" className="" />
            </div>
          </form>
          <Link to="Signup" className="signup-link">
            Don't have an account?{" "}
            <span className="">Register Now</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
