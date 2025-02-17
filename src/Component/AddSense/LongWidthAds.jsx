import React, { useEffect } from 'react'

const LongWidthAds = (props) => {

      useEffect(() => {
                  // Dynamically create and insert the AdSense script
          
                  if(process.env.NODE_ENV === 'production'){
    
                    window.adsbygoogle = window.adsbygoogle || [];
    
                    const existingScript = document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    
                    if (!existingScript) {
                      const script = document.createElement('script');
                      script.async = true;
                      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9796833231647897';
                      script.crossOrigin = 'anonymous';
                      document.head.appendChild(script);
                    }
                
                  
                    const timeout = setTimeout(() => {
                      try {
                        if (window.adsbygoogle) {
                          window.adsbygoogle.push({});
                        }
                      } catch (e) {
                        console.error('AdSense error:', e);
                      }
                    }, 500);
              
                    return () => clearTimeout(timeout);
                  }
                }, []);    
      if (process.env.NODE_ENV !== 'production') {
        return null;
      }
  return (
    <div style={{width : '100%', maxHeight : '200px',overflow : 'hidden' }}>
        <ins className="adsbygoogle"
      style={{ display: 'block', width: '100%', minWidth: '300px', maxHeight : '100%',background : props.background || '#fff' , textAlign : 'center'}} 
     data-ad-format="autorelaxed"
     data-ad-client="ca-pub-9796833231647897"
     data-ad-slot="4571350183"
     data-full-width-responsive="true"></ins>
    </div>
  )
}

export default LongWidthAds
