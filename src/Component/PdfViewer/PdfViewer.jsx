import React from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewer = ({ pdfUrl, onClose }) => {

    // Function to transform Google Drive view link to direct-download link
    const getDirectPdfUrl = (url) => {
        if (url.includes("drive.google.com/file/d/")) {
            const fileId = url.split("/d/")[1]?.split("/")[0];
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        return url; // Return the original URL if it's not a Google Drive link
    };

    const getDownloadUrl = (url) => {
        if (url.includes("drive.google.com/file/d/")) {
            const fileId = url.split("/d/")[1]?.split("/")[0];
            return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
        return url; // Return the original URL if it's not a Google Drive link
    };

    const directPdfUrl = getDirectPdfUrl(pdfUrl);
    const downloadUrl = getDownloadUrl(pdfUrl);

    // Function to create a download link
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "DownloadedFile.pdf"; // Set the default file name for download
        document.body.appendChild(link); // Append the link to the document
        link.click(); // Programmatically click the link to trigger download
        document.body.removeChild(link); // Remove the link after download
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                zIndex: 1000,
            }}
        >
            {/* Close Button */}
            <div style={{ height: '5rem ', width: '100%', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <div>
                    <div style={{ display  : 'inline-block', padding : '0.5rem 1rem', backgroundColor : 'red', color : '#fff', borderRadius : '0.2rem', fontWeight : '600',fontSize : '1rem'}}>
                        PDF
                    </div>
                    <span style={{color : '#fff', margin : '0rem 0.5rem', fontSize : '1rem', fontWeight : '600'}}>
                    STUDYVAULT
                    </span>
                </div>
                <div style={{}}>

                    <button
                        onClick={handleDownload}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            border: "none",
                            padding: "10px 20px",
                            color: "#fff",
                            fontSize: "1rem",
                            borderRadius: "0.1rem",
                            cursor: "pointer",
                            zIndex: 1001,
                            margin  : '0rem 1rem'
                        }}
                    >
                       <i className="fa-solid fa-download" style={{color : '#fff', fontSize : '1.3rem'}}></i>
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: "red",
                            border: "none",
                             padding : '0.5rem 1rem',
                            color: "#fff",
                            fontSize: "1rem",
                            borderRadius: "0.1rem",
                            cursor: "pointer",
                            zIndex: 1001,
                            fontWeight : '600',
                            
                            
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
            {/* PDF Viewer using iframe */}
            <iframe
                src={directPdfUrl}
                title="PDF Viewer"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                }}
            ></iframe>
        </div>
    );
};

export default PDFViewer;
