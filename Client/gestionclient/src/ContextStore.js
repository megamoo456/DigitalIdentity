import React, { useState, useEffect, useMemo } from 'react';
// import { useCookies } from 'react-cookie'
export const Context = React.createContext();
const baseUrl = 'http://localhost:5000';

export const ContextStore = ({ children }) => {
    let initialValue = null;
    // const [cookies, setCookie, removeCookie] = useCookies(['USER_SESSION']);
    const [userData, setUserData] = useState(initialValue)
    
    useEffect(() => {
        //if (cookies.USER_SESSION) {
            fetch(`${baseUrl}/auth/getUser`,{
                headers : { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                 }
          
              }).then(res => res.json())
                .then(res => {
                    return setUserData(res.user)
                })
        //}
    }, [])

     console.log(userData)
    const providerValue = useMemo(() => ({ userData, setUserData }), [userData, setUserData])

    return (
        <Context.Provider value={providerValue}>
            {children}
        </Context.Provider>
    )
}