import React from "react";
import "./HomeT.css";
import "remixicon/fonts/remixicon.css";
import Image from "./home-image.png";
import {Link, useNavigate} from 'react-router-dom'


const HomeT = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="main-container">
        <div className="landing-section">
          <div className="inner-landing">
            <div className="home-info">
              <h1>Hi! I Am</h1>
              <h2>{props.title}</h2>
              <p>
                {props.titlepara}
              </p>
              <div className="live-count">
                <div className="counts">
                  <h3>500K+</h3>
                  <p>Users visite this app</p>
                </div>
                <div className="counts">
                  <h3>20K+</h3>
                  <p>Users use this app</p>
                </div>
                <div className="counts">
                  <h3>1K+</h3>
                  <p>Total Resources download </p>
                </div>
              </div>
              <div className="buttons-home">
                <button onClick={()=>{
                  navigate('About-us');
                }}>Read me</button>
                <Link to="/LogIn/Signup">
                  Sign Up <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="home-image-section">
              <div className="background-image">
                {/* <img src={Image} alt="not found" /> */}
              </div>
              <div className="overfolw-box box-one">
              <i className="fa-solid fa-cloud"></i>
                <div>
                <h2>Questions Papers</h2>
                <p>I am always for you Here</p>
                </div>
              </div>
              <div className="overfolw-box box-two">
              <i className="fa-solid fa-file-pdf"></i>
                <div>
                <h2>Notes</h2>
                <p>I also provide you Notes</p>
                </div>
              </div>
              <div className="overfolw-box box-three">
              <i className="fa-solid fa-id-card-clip"></i>
                <div>
                <h2>Documnets</h2>
                <p>You can save you college document Securly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomeT;
