import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './Downloadpdf.css'
import LongWidthAds from "../../../../Component/AddSense/LongWidthAds";
import AritcleAds from "../../../../Component/AddSense/AritcleAds";


const Downloadpdf = (props) => {
    const navigate = useNavigate();
    // const { state } = useLocation();
    const location = useLocation();

    const [papers, setPapers] = useState([]);
    const searchRef = useRef();
    const [searchbaractivecheck, setsearchbaractivecheck] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [clickCount, setClickCount] = useState(0); // Track clicks for ads
    const [showAd, setShowAd] = useState(false); // Show interstitial ad
    const [networkslow, setNetworkslow] = useState(false);
    const { data } = location.state || {};

    useEffect(() => {
      const networkslowtimeout =  setTimeout(() => {
            setNetworkslow(true);
        }, 10000);

        return ()=> clearTimeout(networkslowtimeout)
    }, [loading])

    useEffect(()=>{
        if(data){
            setPapers(data);
        setLoading(true);
        }else{
            setPapers([{ id: "error", title: "Error loading papers, please try again later." }]);
            setLoading(true);
        }
        
    },[])

    // useEffect(() => {
    //     const fetchPapers = async () => {

    //         try {

    //             const response = await axios.get('/api/Filter', { params: state.filters });

    //             setPapers(response.data);
    //             setLoading(true);

    //         } catch (error) {
    //             console.error('Error fetching papers:', error);
    //             setLoading(true);
    //             setPapers([{ id: "error", title: "Error loading papers, please try again later." }]);
    //         }
    //     };

    //     fetchPapers();
    // }, [state.filters]);



    const filteredPapers = papers.filter((paper) =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleclicksearch = () => {
        if (!searchbaractivecheck) {
            searchRef.current.style.transform = 'translate(0%) scale(1)';
            searchRef.current.style.margin = ' 2rem 0';
            searchRef.current.style.opacity = ' 1';

            setsearchbaractivecheck(!searchbaractivecheck);
        } else {
            searchRef.current.style.transform = 'translateY(-100%) scale(0)';
            searchRef.current.style.margin = ' 0rem 0';
            searchRef.current.style.opacity = '0';
            setsearchbaractivecheck(!searchbaractivecheck);
        }

    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const backnavigate = () => {
        navigate(-1);
    }



    const handleClickPaper = (paper) => {
        setClickCount((prevCount) => prevCount + 1);

        // Show interstitial ad after every 3 clicks
        if ((clickCount + 1) % 2 === 0) {
            // setShowAd(true);
        //   const timout =   setTimeout(() => {
        //         setShowAd(false);
        //         window.open(paper.url, "_blank"); // Open question paper after ad
        //     }, 5000); // Show the ad for 5 seconds
        //     return ()=> clearTimeout(timout)
        window.open(paper.url, "_blank"); // Open question paper immediately
        } else {
            window.open(paper.url, "_blank"); // Open question paper immediately
        }

    };




    return (
        <>
            {/* <BackButton /> */}
            <div id='download-pdf' >
                <header>
                    <div className="back-to-filter active" onClick={backnavigate}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                    <h1>StudyVault<sub>Downloads</sub></h1>
                    <div className="search-resources back-to-filter active" onClick={handleclicksearch}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    {/* <hr /> */}
                </header>

                <div className="download-box">
                    <div className="search-resuorces" ref={searchRef}>
                        <input type="text" name="search" id="search" placeholder="Search Core / Paper Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <h2>RESULTS</h2>

                    {loading ? (<div className="download-data">
                        {filteredPapers.length > 0 && filteredPapers ? (
                            filteredPapers.map((paper) => (
                                <li key={paper.id} onClick={() => handleClickPaper(paper)} >
                                    <div className="each-paper-box" >{paper.title}<div className="paper-downlon-button"><i className="fa-solid fa-download"></i></div></div>
                                    {/* <hr /> */}
                                </li>
                            ))
                        ) : (
                            <div>
                                <p style={{ color: '#000', fontSize: '1.2rem', fontWeight: '500' }}>Not Available</p>

                            </div>


                        )}
                    </div>) : (
                        <div className="download-data">
                            <p style={{ color: '#000', fontSize: '1rem', fontWeight: '500', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <box-icon name='loader' flip='vertical' animation='spin' color="#000"  ></box-icon>  Loading...</p>
                            {networkslow && !loading && (<p style={{ padding: '5rem 0 0', color: '#000' }}>Slow Network<i className="fa-solid fa-wifi" style={{ padding: '0rem 1rem', color: "red", fontSize: '1rem' }}></i></p>)}
                        </div>
                    )}

                    {/* <LongWidthAds background="rgb(242 244 246)" /> */}

                    {showAd && (
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                                zIndex: 999999999999,
                            }}
                        >
                            <button
                                style={{
                                    position: "absolute",
                                    top: "1rem",
                                    right: "1rem",
                                    color: "white",
                                    background: "transparent",
                                    border: "none",
                                    fontSize: "1.5rem",
                                    cursor: "pointer",
                                }}
                                onClick={() => setShowAd(false)}
                            >
                                ×
                            </button>
                            <div>
                                {/* <AritcleAds Height = '100%'/> */}
                            </div>
                        </div>
                    )}
                    <div className="name-instruction">
                        <h3>INSTRUCTION :)</h3>
                        <p style={{ fontWeight: '500' }}>If  you don't understand the naming system then i will guide you to understand. Here is the decode...</p>
                        <p style={{ padding: '0rem 0 0 1rem', color: 'black', fontSize: '0.9rem' }}>Department Name / Paper Name --Student Year -- which Semester -- Core paper Name -- sem / mid -- Ug/Pg -- Session.</p>

                        <p style={{ margin: '4rem 0', color: '#000', fontWeight: '600' }}>Don't Forgate to give feedback.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Downloadpdf
