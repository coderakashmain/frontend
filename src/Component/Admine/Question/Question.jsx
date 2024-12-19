import React, { useContext, useState, useRef, useEffect } from 'react'
import Lottie from 'lottie-react'
import loadinganimation from '../../../photo/lottieflow-loading-04-2-000000-easey.json'
import { FetchDataContext } from '../../../Context/FretchDataContext/FetchData'
import { degrees,PDFDocument, rgb } from 'pdf-lib';


import './Question.css'
import { Departmentlistdata } from '../../../Context/DepartmentList/DepartmentListContext'
import axios from 'axios'


const Question = (props) => {
    const departmentlist = useContext(Departmentlistdata);
    const {setPaperList} = useContext(FetchDataContext);
    const [selectedFile, setSelectedFile] = useState('');
    const [departmetvalue, setDartmentvalue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showSuggestionspaper, setShowSuggestionspaper] = useState(false);
    const [singletap, setSingletap] = useState(false);
    const hideeSarchSuggestion = useRef();
    const [fetchData, setFetchData] = useState([]);
    const [honors, setHonors] = useState(true);
    const [elective, setElective] = useState(false);
    const [Compulsory, setCompulsory] = useState(false);
    const [eandv, setEandv] = useState(false);
    const [updatedata,setUpdatedata] = useState('');
    const paperboxhide = useRef();
    const fileInputRef = useRef();
   
    const [filtetuploaddata, setFiltetuploaddata] = useState(
        {
            departmentName: '',
            educationLavel: '',
            session: '',
            dptyear: '',
            semormid: '',
            paperName: '',
            studentyear: ''

        }
    );

       
    useEffect(() => {
        const yearMap = {
            '1stsem': '1st',
            '2ndsem': '1st',
            '3rdsem': '2nd',
            '4thsem': '2nd',
            '5thsem': '3rd',
            '6thsem': '3rd',
            '7thsem': '4th',
            '8thsem': '4th'
        };

        const studentyear = yearMap[filtetuploaddata.dptyear] || '';

        setFiltetuploaddata((prevData) => ({
            ...prevData,
            studentyear
        }));
    }, [filtetuploaddata.dptyear]);


    const handleFileChange = (e) => {
       
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            props.showAlart('Failed', 'Please select a valid PDF file.', 'cancel');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset the file input
            }
        }
    };


    const addWatermark = async (file, watermarkText) => {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
    
        pages.forEach((page) => {
            const { width, height } = page.getSize();
            page.drawText(watermarkText, {
                x: width / 2 - 100,
                y: height / 2,
                size: 40,
                color: rgb(0.75, 0.75, 0.75),
                opacity: 0.6,
                rotate: degrees(45),
            });
        });
    
        const watermarkedPdfBytes = await pdfDoc.save();
        const watermarkedFile = new File([watermarkedPdfBytes], file.name, { type: file.type });
        return watermarkedFile;
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const newFileName = `${filtetuploaddata.departmentName}_${filtetuploaddata.studentyear}_${filtetuploaddata.dptyear}_${filtetuploaddata.paperName}_${filtetuploaddata.semormid}_${filtetuploaddata.educationLavel}_${filtetuploaddata.session}.pdf`;
            // Rename the file
            const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });
            const watermarkedFile = await addWatermark(renamedFile, 'StudyVault - Protected');
            return watermarkedFile;
        }
        return null;
    };
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSingletap(true);

        const fileToUpload = await handleUpload(); // Get renamed file
        if (!fileToUpload) {
            props.showAlart('Selet a File', 'Please select a valid file.', 'cancel');
            setSingletap(false);
            return;
        }
        // Prepare FormData for the POST request
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('renameFileback', fileToUpload.name);
        // formData.append('userid', user.id);
        formData.append('filtetuploaddata', JSON.stringify(filtetuploaddata));
        // console.log(fileToUpload);

        try {
            const response = await axios.post('/api/Admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const fileId = response.data.fileId; // Google Drive File ID
                // const driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
                // window.open(driveUrl);
                // alert(driveUrl);
                // Reset states and show success message
                setSelectedFile('');
                setFiltetuploaddata({
                    departmentName: '',
                    educationLavel: '',
                    session: '',
                    dptyear: '',
                    semormid: '',
                    paperName: '',
                    studentyear: ''
                });
                setSingletap(false);
                // if (fileInputRef.current) fileInputRef.current.value = '';
                setDartmentvalue('');
                props.showAlart('Successfully uploaded.', '', 'check');
                setElective(false);
                setCompulsory(false);
                setEandv(false);
                setHonors(true);
            } else {
                props.showAlart('External Error', 'Failed to upload the file.', 'cancel');
                setSingletap(false);
             
            }
        } catch (error) {
            if(error.response && error.response.status === 401){
                props.showAlart('Department does not exist', 'Failed to upload the file.', 'cancel');
                return;

            }
            if(error.response && error.response.status === 400){
                props.showAlart('File already present', 'Failed to upload the file.', 'cancel');
                return;

            }
            if(error.response && error.response.status === 500){
                props.showAlart('Failed to save file information to the database', 'Failed to upload the file.', 'mark');
                return;

            }
            if(error.response && error.response.status === 502){
                props.showAlart('Failed to verify file existence', 'Failed to upload the file.', 'mark');
                return;

            }
            
            console.error('Error uploading file:', error);
            props.showAlart('Unexpected Error', 'Failed to upload the file.', 'cancel');
            setSingletap(false);
        } finally {
            setSingletap(false);
        }
    };






    const deparmentChange = (e) => {
        setDartmentvalue(e.target.value);
        setUpdatedata(e.target.value);
        setShowSuggestions(true);
        handlechange(e);

    }
    useEffect(() => {
        const handlehide = (event) => {
            if (hideeSarchSuggestion.current && !hideeSarchSuggestion.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        const paperhide = (event) =>{
            if(paperboxhide.current && !paperboxhide.current.contains(event.target)){
                setShowSuggestionspaper(false);
            }
        }
        document.addEventListener("mousedown", handlehide);
        document.addEventListener("mousedown", paperhide);

        return () => {
            document.removeEventListener("mousedown", handlehide);
            document.removeEventListener("mousedown", paperhide);
        }
    });

    const handlechange = (e) => {
        const { name, value } = e.target;
        if( name === 'paperName'){
            setShowSuggestionspaper(true);
        }
        setFiltetuploaddata((preData) => ({
            ...preData,
            [name]: value,

        }))
    };
    useEffect(()=>{
        if(!filtetuploaddata.paperName)
        setShowSuggestionspaper(false);
    },[filtetuploaddata.paperName]);

  
    useEffect(()=>{
        const fatchData = async ()=>{
            try{
                const response = await axios.get('/api/admin/fetchData',{withCredentials : true});
                if(response.status === 200){
                    setFetchData(response.data);
                    setPaperList(response.data);
                }
                else{
                    props.showAlart('Error fetching Data', "", 'mark')
                }
            }catch{
                props.showAlart('Error fetching Data', "", 'mark');
            }
        }
        fatchData();
    },[singletap]);

    const  handlesubjet = (e)=>{
        const value = e.target.innerText
     
        if(value !== 'Honors'){

            setDartmentvalue(value);
        }
        else{
            setDartmentvalue(updatedata);
        }
        setFiltetuploaddata({
          ...filtetuploaddata,
          departmentName: value === 'Honors' ? updatedata : value,
        });
    }


 const subjectlist = [
    'C-1',
    'C-2',
    'C-3',
    'C-4',
    'C-5',
    'C-6',
    'C-7',
    'C-8',
    'C-9',
    'C-10',
    'C-11',
    'C-12',
    'C-13',
    'C-14',
    'C-101',
    'C-102',
    'C-103',
    'C-105',
    'C-201',
    'C-202',
    'C-203',
    'C-204',
    'C-205',
    'C-301',
    'C-302',
    'C-303',
    'C-304',
    'C-305',
    'C-1.1',
    'C-1.2',
    'C-1.3',
    'C-1.4',
    'C-1.5',
    'C-2.1',
    'C-2.2',
    'C-2.3',
    'C-2.4',
    'C-2.5',
    'PHY GE-1',
    'MATH GE-1',
    'MATH GE-2',
    'MATH GE-3',
    'PHY GE-3',
    'MATH GE-4',
    'CHEM GE-1',
    'CHEM GE-2',
    'CHEM GE-3',
    'CHEM GE-4',
    'HIST GE-2',
    'HIST GE-4',
    'P.SC GE-1',
    'P.SC GE-3',
    'BCA GE-1',
    'BCA GE-2',
    'COM GE-1',
    'COM GE-2',
    'COM GE-3',
    'COM GE-4',
    'ZOOL GE-2',
    'ZOOL GE-4',
    'ODIA GE-2',
    'ODIA GE-4',
    'AECC-1(EVS)',
    'AECC-2(ODIA)',
    'AECC-2(HINDI)',
    'AECC-2(ENGLISH)',
    'AECC-2(SANSKRIT)',
    'SEC-1(CE)',
    'SEC-2(QLT)',
    'DSE-1',
    'DSE-2',
    'DSE-3',
    'DSE-4',
    'E&V-1',
    'E&V-2',
    'E&V-3',
    'E&V-4',
    'E&V-5',
    'E&V-6',
 ]


    return (
        <>
        <aside id='question'>
            <h2>Question Papers<i className="fa-solid fa-clipboard-question" style={{ margin: '0 0.5rem' }}></i></h2>
            <form onSubmit={handleSubmit}>
                <div className="question-box">

                    <input type="file" accept="application/pdf" name="ApaperUpload" id="" onChange={handleFileChange} />
                    <div className="filestorebox">

                        <input type="text" value={selectedFile ? selectedFile.name : 'Please Select a File :'} readOnly={true} />
                        <button onClick={() => {
                            setSelectedFile(null)
                            props.showAlart('Cleard', '', 'check');

                        }}>Clear</button>
                    </div>

                    <div className="inputQuestinBox">
                        <div className="inputQuestinBox-each inputQuestinBox-in">
                            <input type="text" id='Asearch' name='departmentName' placeholder='Department Name' onChange={deparmentChange} value={departmetvalue} required  readOnly={Compulsory || elective || eandv ? true : false} 
                            className={`${Compulsory || elective || eandv ? 'paperdis' : 'paperen'}`} />
                            {showSuggestions && (<div ref={hideeSarchSuggestion} className="search-suggestion">
                                {departmetvalue ? (
                                    departmentlist && departmentlist.filter((item) => {
                                        const data = item.toLowerCase();
                                        const searchTerm = departmetvalue.toLowerCase();
                                        return data.startsWith(searchTerm);
                                    }).length === 0 ? (
                                        <div className="search-item">
                                            <p>No Departments available</p>
                                        </div>
                                    ) : (
                                        departmentlist.filter((item) => {
                                            const data = item.toLowerCase();
                                            const searchTerm = departmetvalue.toLowerCase();
                                            return data.startsWith(searchTerm) && data !== searchTerm;
                                        }).map((departmentlist, index) => (
                                            <div onClick={(e) => {
                                                setShowSuggestionspaper(false);
                                                setDartmentvalue(departmentlist);
                                                setUpdatedata(departmentlist);
                                                setFiltetuploaddata((preData) => ({
                                                    ...preData,
                                                    departmentName: departmentlist,

                                                }))

                                            }} className="search-item" key={index}>
                                                <p >{departmentlist}</p>
                                            </div>
                                        ))
                                    )
                                ) : null}
                            </div>)}
                        </div>

                        <div className="leftfilter-select-item inputQuestinBox-in">
                            <select onChange={handlechange} value={filtetuploaddata.educationLavel} name="educationLavel" id="dptnameselect" required readOnly={singletap ? true : false}>
                                <option value="" readOnly={singletap ? true : false}>Select Education Level</option>
                                <option value="ug">Under Graduation(UG)</option>
                                <option value="pg">Post Graduation(PG)</option>
                            </select>

                        </div>

                        <div className="leftfilter-select-item inputQuestinBox-in">
                            <input onChange={handlechange} value={filtetuploaddata.session || ''} type="number" name='session' placeholder=" Session (2024)" required pattern="[0-9]{4}" readOnly={singletap ? true : false} />

                        </div>

                        <div className="leftfilter-select-item inputQuestinBox-in">
                            <select onChange={handlechange} value={filtetuploaddata.dptyear} name="dptyear" id="dptyear" required readOnly={singletap ? true : false}>
                                <option value="">Choose Semester</option>
                                <option value="1stsem">1st sem</option>
                                <option value="2ndsem">2nd sem</option>
                                <option value="3rdsem">3rd sem</option>
                                <option value="4thsem">4th sem</option>
                                <option value="5thsem">5th sem</option>
                                <option value="6thsem">6th sem</option>
                                <option value="7thsem">7th sem</option>
                                <option value="8thsem">8th sem</option>
                            </select>

                        </div>


                        <div className="leftfilter-select-item inputQuestinBox-in">
                            <select onChange={handlechange} value={filtetuploaddata.semormid} name="semormid" id="semormid" required readOnly={singletap ? true : false}>
                                <option value="">Select Exam type</option>
                                <option value="midSem">Mid Semester</option>
                                <option value="sem">Semester</option>
                            </select>

                        </div>

                        <div className="leftfilter-select-item inputQuestinBox-in">
                            <input  onChange={handlechange} value={filtetuploaddata.paperName} type="text" name='paperName' placeholder=" Paper Name (Core-1)" required readOnly={singletap ? true : false} />

                            {showSuggestionspaper && (<div ref={paperboxhide}  className="search-suggestion">
                                { filtetuploaddata.paperName ? (
                                    subjectlist && subjectlist.filter((item) => {
                                        const data = item.toLowerCase();
                                        const searchTerm = filtetuploaddata.paperName.toLowerCase();
                                        return data.startsWith(searchTerm);
                                    }).length === 0 ? (
                                        <div className="search-item">
                                            <p>No paper type available</p>
                                        </div>
                                    ) : (
                                        subjectlist.filter((item) => {
                                            const data = item.toLowerCase();
                                            const searchTerm = filtetuploaddata.paperName.toLowerCase();
                                            return data.startsWith(searchTerm) && data !== searchTerm;
                                        }).map((subjectlist, index) => (
                                            <div onClick={(e) => {
                                                setFiltetuploaddata((preData) => ({
                                                    ...preData,
                                                    paperName: subjectlist,

                                                }))

                                            }} className="search-item" key={index}>
                                                <p >{subjectlist}</p>
                                            </div>
                                        ))
                                    )
                                ) : null}
                            </div>)}

                        </div>
                        <div className="subject-select">
              <div className="subject-select-each">
                
                  <p onClick={(e)=>{
                    
                    handlesubjet(e);
                    setHonors(!honors);
                    setElective(false);
                    setCompulsory(false);
                    setEandv(false);
                    
                    }} className={`${honors ? 'ok' : 'no'}`}>Honors</p>
              </div>
              <div className="subject-select-each">
                  <p onClick={(e)=>
                    
                    {setElective(!elective);
                      handlesubjet(e);
                      setCompulsory(false);
                    setEandv(false);
                    setHonors(false);

                    }}
                     className={`${elective ? 'ok' : 'no'}`}>Elective</p>
              
              </div>
              <div className="subject-select-each">
                  <p onClick={(e)=>
                  
                  {setCompulsory(!Compulsory);
                    handlesubjet(e);
                    setEandv(false);
                    setHonors(false);
                    setElective(false);

                  }}  className={`${Compulsory ? 'ok' : 'no'}`}>Compulsory</p>

              </div>
              <div className="subject-select-each">
                  <p onClick={
                    (e)=>{setEandv(!eandv);
                      handlesubjet(e);
                     setCompulsory(false);
                    setHonors(false);
                    setElective(false);

                    }
                
                } className={`${eandv ? 'ok' : 'no'}`}>E&V</p> 
              
              </div>


            </div>

                    </div>
                    <div className="AUploadusubmit">
                        <button onClick={() => {
                            setDartmentvalue('');
                            setFiltetuploaddata({
                                departmentName: '',
                                educationLavel: '',
                                session: '',
                                dptyear: '',
                                semormid: '',
                                paperName: '',
                                studentyear: ''
                            });
                            setSingletap(false);
                            props.showAlart('Cleard', '', 'check')
                        }}>Reset All</button>
                        <button type='submit'>Upload</button>
                    </div>

                    
                </div>
            </form>
            <h3 style={{margin : '1rem 0rem',display : 'block', textAlign : 'center',padding : '0.4rem 0',backgroundColor : 'rgb(34 100 162)', color  :  '#fff',borderRadius : '0.2rem'}}>All PDF</h3>
                <hr style={{margin : '0rem 0rem 0.5rem'}} />
            <div className="fetchBox">
                
            {fetchData.length > 0 ? (
                        fetchData.map((fetchData) => (
                            <li key={fetchData.id}>
                                 <i className="fa-solid fa-star" style={{ color: '#00000094'}}></i> <a href={fetchData.url} download target='__blank'>{fetchData.title}<i className="fa-solid fa-file-pdf" style={{ padding : '0rem 1rem', fontSize : '1.3rem', color : '#ce0d0d'}}></i></a>
                            </li>
                        ))
                    ) : (
                        <p>No papers found</p>
                    )}
            </div>
           {singletap &&( <div style={{ height: '100svh', width: '100%', backgroundColor: 'rgb(0 0 0 / 44%)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute',top: '0%', left : '0%' ,transform : 'scale(1)'}}>
                <Lottie animationData={loadinganimation} loop={true} autoPlay={true} style={{ width: '4rem', height: '4rem' }} />
            </div>)}
        </aside>
      
        </>
    )
}

export default Question
