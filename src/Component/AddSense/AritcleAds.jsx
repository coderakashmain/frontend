import React, { useEffect } from 'react'

const AritcleAds = (props) => {

       useEffect(() => {
              // Dynamically create and insert the AdSense script
      
              if(process.env.NODE_ENV === 'production'){
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9796833231647897';
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
            
                // Push the ad to initialize after the script loads
                script.onload = () => {
                  if (window.adsbygoogle) {
                    window.adsbygoogle.push({});
                  }
                };
            
                return () => {
                  // Cleanup the script when the component unmounts
                  document.head.removeChild(script);  
                };
              }
            }, []);  
            if (process.env.NODE_ENV !== 'production') {
              return null;
            }
    
  return (
    <div style={{width: '100%', overflow : 'hidden' }}>
      <ins className="adsbygoogle"
     style={{display : 'block', textAlign : 'center',width :'100%', minWidth : '150px' , background : props.background  || 'var( --notificationbackcolor )'}}
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-9796833231647897"
     data-ad-slot="9011527763"></ins>
    </div>
  )
}

export default AritcleAds

