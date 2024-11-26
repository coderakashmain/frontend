import React, { createContext, useContext, useEffect,useState } from 'react'
import { UserContext } from '../UserContext/UserContextdata';
import axios from 'axios';

export const Userlogincheckcontext = createContext();

const UserLoginContext = (props) => {
    const {usernav} = useContext(UserContext);
   
    const  [loginCheck, setLoginCheck] = useState(null);

    useEffect(() => {
        const fetchuserlogin = async () => {
            try {
                const response = await axios.get('/api/login-check-context', { withCredentials: true });

                if (response.status === 200) {
                    setLoginCheck(response.data);
                   
                }
            }
            catch (error) {
                if (error.response && error.response.status === 500) {
                    setLoginCheck(null);
                    console.error('Unauthorized',error)
                }
                if (error.response && error.response.status === 404) {
                    setLoginCheck(null);
                    console.error('Unauthorized',error)
                }
                else {
                    setLoginCheck(null);
                    console.error('Unauthorized',error);
                }
            }
        }
        fetchuserlogin();
    }, [usernav]);
    return (
        <Userlogincheckcontext.Provider value  = {loginCheck}>
            {props.children}
        </Userlogincheckcontext.Provider>
    )
}

export default UserLoginContext