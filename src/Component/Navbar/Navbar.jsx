import React, { useEffect, useState } from "react";
import "./Navbar.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { NavLink, Link, useNavigate,useLocation } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nav, setNav] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure want to  log out ?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
      props.showAlart("Log out", "Back to main page");
      setIsAuthenticated(false);
    }
  };

  useGSAP(() => {
    const hambargar = document.querySelector(".hambargar");
    const crossicon = document.querySelector(".cross-icon i");

    const openTl = gsap.timeline({ paused: true });

    openTl
      .to(".slidebar", {
        left: 0,
        duration: 0.3,
      })
      .from(".slidebar-title", {
        x: 100,
        duration: 0.3,
        stagger: 0.2,
        opacity: 0,
      })
      .from(".cross-icon i", {
        y: -10,
        opacity: 0,
        duration: 0.2,
      })
      .from(".copywrite", {
        opacity: 0,
        duration: 0.15,
      });

    const closeTl = gsap.timeline({ paused: true });

    closeTl.to(".slidebar", {
      left: -950,
      duration: 0.4,
    });

    hambargar.addEventListener("click", () => {
      openTl.restart();
      gsap.to(".slidebar", {
        display: "block",
        duration: 0.01,
      });
    });

    crossicon.addEventListener("click", () => {
      closeTl.restart();
    });
    const refrasher = document.querySelectorAll(".slidebar-title a");

    refrasher.forEach((e) => {
      e.addEventListener("click", () => {
        gsap.to(".slidebar", {
          display: "none",
          duration: 0.01,
        });
      });
    });
  });

  useEffect(() => {
    
      const navbar = document.querySelector(".navbar");
      const handleScroll = () => {
        if (window.scrollY > 200) {
          setNav(true);
        } else {
          setNav(false);
        }
      };
      window.addEventListener("scroll", handleScroll);

      let isScrollingDown = false;
      const handleWheel = (ele) => {
        if (window.scrollY >= 100) {
          if (ele.deltaY <= 0) {
            if (!isScrollingDown) {
              isScrollingDown = true;
              navbar.style.transform = "translateY(0%)";
            }
          } else {
            if (isScrollingDown) {
              isScrollingDown = false;
              navbar.style.transform = "translateY(-100%)";
            }
          }
        } else {
          navbar.style.transform = "translateY(0%)";
        }
      };
      window.addEventListener("wheel", handleWheel);
    
    return  () =>{
      window.removeEventListener("scroll",handleScroll) ;
      window.removeEventListener('wheel',handleWheel) ;
    }
  }, []);

  const getNavClass = (path) => {
    return location.pathname === path ? 'red' : '';
  };

  return (
    <>
      <div
        className={`navbar 
         ${nav ? "home-nav" : "black-nav"}
      ${location.pathname === '/' ? (nav ? "home-nav" : "black-nav") : ""}
      ${location.pathname === '/Profile' ? "profile-nav" : ""}
      ${location.pathname === '/Contact-Us' ? "contact-nav" : ""}
      ${location.pathname === '/About-us' ? "about-nav" : ""}
      ${location.pathname === '/LogIn' ? "login-nav" : ""}
        `}
      >
        <div className="navber-box">
          <div className="hambargar">
            <i className="fa-solid fa-bars"></i>
          </div>
          {/* <div className="web-logo">
                <h2> A℃©®</h2>
              
          </div> */}
          <div className="nav-list">
            <ul>
            <NavLink className={getNavClass('/')} to="/"><li>Home</li></NavLink>
            <NavLink className={getNavClass('/Profile')} to="/Profile"><li>Profile</li></NavLink>
            <NavLink className={getNavClass('/Contact-Us')} to="/Contact-Us"><li>Contact Us</li></NavLink>
            <NavLink className={getNavClass('/About-us')} to="/About-us"><li>About us</li></NavLink>
            </ul>
          </div>

          {!isAuthenticated ? (
            <div className="log-in">
                <NavLink className={getNavClass('/LogIn')} to="/LogIn"><li>Login</li></NavLink>
            </div>
          ) : (
            <div className="log-in">
              <NavLink onClick={handleLogout} ><li>Logout</li></NavLink>
            </div>
          )}
        </div>
      </div>
      <div className="slidebar">
        <div className="cross-icon">
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="slidebar-box">
          <h4 className="slidebar-title">
            <Link to="/">
              <i className="fa-solid fa-house-chimney"></i>Home
            </Link>
          </h4>
          <h4 className="slidebar-title">
            <Link to="/Profile">
              <i className="fa-solid fa-user"></i>Profile
            </Link>
          </h4>
          <h4 className="slidebar-title">
            <Link to="/About-us">
              <i className="fa-solid fa-pen"></i>About Us
            </Link>
          </h4>
          <h4 className="slidebar-title">
            <Link to="/Contact-Us">
              <i className="fa-solid fa-paper-plane"></i>Contact Us
            </Link>
          </h4>
        </div>
        <div className="copywrite">
          <p>Copyright 2024 All rights reserved |</p>
          <p>This website is made by</p>
          <p>akashjitu.com </p>
        </div>
        <div className="slidebar-foot-item">
          <p>V.1.0.1</p>
        </div>
      </div>
      <div className="glitchproblem"></div>
    </>
  );
};

export default Navbar;

// const [activeStatus,setActiveStatus] = useState(false);

// const handleActive = (e)=>{
//       if(e.isActive){
//         setActiveStatus(true);
//       }
//       else{
//         setActiveStatus(false)
//       }
// }
