
import { useEffect, useState } from "react"
import "./Signup.css"
import axios from "axios"
import {Link, useNavigate} from 'react-router-dom'
import BackButton from "../../Component/Backbutton/Backbutton"



const Signup = (props) => {
  const [signupdata, setSignupdata] = useState({
    firstname : '',
    lastname : '',
    rollno : '',
    gmail : '',
    password : '',
    passwordcheck : ''
  });

  const navigate = useNavigate();
  const [otp,setOtp]=useState(false);
  const [verifyOtp,setVerifyOtp] = useState(false);
  const [verifyOtpsubmit,setVerifyOtpsubmit] = useState(false);
  const [message, setMessage] = useState('');
  const [otpValue,setOtpValue] = useState('');
  const [submitoff, setSubmitoff] = useState(false);
  const [passwordcheck, setPasswordcheck] = useState(false);
  const [spinner, setSpinner] =useState(false)
  const [disablebtn ,setDisablebtn] = useState(false);

  const signupchange = (e) =>{
    const {name,value} = e.target;
    setSignupdata((preData) =>({
      ...preData,
      [name] : value,
    }));
    
  }
  useEffect(()=>{
    if(signupdata.gmail){

      setOtp(true);
    }
    if(!signupdata.gmail){

      setOtp(false);
      setVerifyOtp(false);
      setVerifyOtpsubmit(false);
      setOtpValue('');
      setMessage('')
      setSubmitoff(false);
    }
   
  },[signupdata.gmail]);

  useEffect(()=>{
    if(signupdata.password){
      setPasswordcheck(true);
    }
    if(!signupdata.password){
      setPasswordcheck(false);
    }
  },[signupdata.password])

  const handleOtpSubmit = async (e)=>{
    e.preventDefault();
    if(otp){
      try{
        setSpinner(true);
        setDisablebtn(true);
        const response = await axios.post('/api/LogIn/Signup/otpVarify',{email : signupdata.gmail})
        if(response.status === 200){
          props.showAlart('OTP send Successfully ');
           setVerifyOtp(true);
           setVerifyOtpsubmit(true);
           setSpinner(false);
           setDisablebtn(false);
           setMessage(<p style={{margin :'0 0 0.45rem 0',fontSize :'0.5rem'}}>OTP valid for 10 minutes.</p>)

        }
  
      }
      catch(error){
        if(error.response && error.response.status ===410){
          props.showAlart('internal error ');
          setDisablebtn(false);
        }
        if(error.response && error.response.status ===420){
           setVerifyOtp(true);
           setVerifyOtpsubmit(true);
           setDisablebtn(false);
          
        }
        if(error.response && error.response.status ===500){
          props.showAlart('error in genereting OTP');
          setDisablebtn(false);
        }
      }
    }
    else{
      props.showAlart('Enter your email');
      setDisablebtn(false);
    }
    
  };

  const handlevarifyotpfinal = async(e)=>{
    e.preventDefault();
    if(otpValue){ 
      try{
         await axios.post('/api/LogIn/Signup/otpVarify/confirm',{email : signupdata.gmail, otp : otpValue});

        
          props.showAlart('Email verify successfull');
          setSubmitoff(true);
          setMessage(<p style={{margin :'0 0 0.45rem 0',fontSize :'0.5rem',color : 'green'}} >Email verify successfull</p>)
          setOtpValue('');
          setVerifyOtp(false);
          setOtp(false);
          setDisablebtn(false);
        
      }
      catch(error){
          if(error.response && error.response.status === 410){
            props.showAlart('OTP expired');
            setDisablebtn(false);
          }
          if(error.response && error.response.status === 409){
            props.showAlart('Error updating data ');
            setDisablebtn(false);
          }
          if(error.response && error.response.status === 405){
            props.showAlart('Invalid OTP ');
            setMessage(<p style={{margin :'0 0 0.45rem 0',fontSize :'0.5rem',color : 'red'}} >Invalid OTP</p>)
            setDisablebtn(false);
          }
         else{

           props.showAlart('Internal error');
           setDisablebtn(false);
         }
          
      }
    }
    else{
      props.showAlart('Please enter  OTP send to your gmail ');
    }
  };

  const signupsubmit = async (e)=>{
    e.preventDefault();
    if(signupdata.password === signupdata.passwordcheck){
      try {
         await axios.post('/api/LogIn/Signup',signupdata);
        navigate("/LogIn");
        props.showAlart('Registerd Seccessfull')
      }
      catch (error) {
        if (error.response && error.response.status === 409) {
          props.showAlart('Email id', 'already exist');
        } 
        if (error.response && error.response.status === 408) {
          props.showAlart("Roll no already exist");
        } else {
          console.error('Error registering user', error);
         
        }
      }
      
    }
    else{
      props.showAlart('Mismatched', 'Your password is not match');
      return;
    }
    
  }

  const showalart =()=>{
    if(!submitoff){

      props.showAlart('Verify your email id first ');
    }
    if(!passwordcheck && submitoff){
      props.showAlart('Please enter your password ');
    }
  }
  return (
    <div id="signup">
      <BackButton/>
      <div className="signup-form">
        <h2>Signup</h2>
        <form onSubmit={otp ? (!verifyOtp ? (handleOtpSubmit):(handlevarifyotpfinal)): (signupsubmit)} >
          <div className="name-box">    
            <div className="first-name-box">
            <label htmlFor="firstname">First Name :- </label>
            <input type="text" name="firstname" onChange={signupchange}    value={signupdata.firstname}  id="firstname" className="singup-form-input" required/>
            </div>
            <div className="last-name-box">
            <label htmlFor="secondname"> Last Name :- </label>
            <input type="text" name="lastname" onChange={signupchange}   value={signupdata.lastname}  id="secondname"className="singup-form-input"/>

            </div>
          </div>
            <label htmlFor="rollno">College Roll No :- </label>
            <input type="text" id="rollno" name="rollno"onChange={signupchange}   value={signupdata.rollno} className="singup-form-input" 
              pattern="[A-Z]{2}[0-9]{2}-[0-9]{1-5}"  required/>
          <label htmlFor="gmail">Gmail :- </label>

          <div style={{display : 'flex',gap : '1.3rem'}} className="signup-gmail-box">
            <input type="email" name="gmail" onChange={signupchange} value={signupdata.gmail}  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
         id="gmail"  className="singup-form-input" required/>
          
         {verifyOtp &&( <input type="number" onChange={(e)=>{setOtpValue(e.target.value)}} value={otpValue} style={{height :'30%',padding : '0.6rem 0.2rem 0.6rem 0.8rem',margin :'auto',border : 'none',borderRadius : '0.2rem',width  : '60%',fontSize : '0.9rem',flexGrow : '1'}} placeholder="OTP" />)}
        {otp && (<button disabled = {disablebtn} type="submit"   style={{textAlign : 'end',padding : '0.6rem 1rem',height : '30%',margin :'auto',outline : 'none',border : 'none',backgroundColor : "lightblue",cursor : 'pointer',borderRadius : '0.2rem',transition : 'all 0.2s ease-in-out'}}>{!verifyOtpsubmit ? (<p style={{fontSize :'0.9rem'}}>{!spinner ? ("Verify") : (<box-icon  name='loader-alt' size = 'sm' flip='horizontal' animation='spin' color='#000' ></box-icon>)}</p>):(<p style={{fontSize :'0.9rem'}} >Confirm</p>)}</button>)}
          </div>
       {message}
         
      
          
            <div className="sigup-password-box">
              <div className="currnet-password-signin">
                <label htmlFor="password">Password :- </label>
                <input type="password" id="password" name="password"onChange={signupchange}  autoComplete="off" value={signupdata.password}  className="singup-form-input" />

              </div>
              <div className="new-password-signin">

                <label htmlFor="passwordcheck">Confirm password :- </label>
                <input type="password" id="passwordcheck" name="passwordcheck" onChange={signupchange} autoComplete="off"  value={signupdata.passwordcheck} className="singup-form-input" />
              </div>
           
            </div>
            
            <input onClick={showalart}  type={passwordcheck ? (!submitoff ? '' : 'submit') : ''}  value="Signup" className="signup-btn" autoCorrect="off" readOnly style={{textAlign : 'center'}}/>

        </form> 
        <hr style={{margin : '1rem 0'}} />
        <div className="already-account">
          <p>Already have an accout?</p>
           <Link to='/LogIn'>Log In</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
