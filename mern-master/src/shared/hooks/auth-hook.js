import {useEffect, useState, useCallback, } from 'react';


let logoutTimer
export const useAuth = () => {
    const [userId, setUserId] = useState(false) //tracking the creator 
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(false);
  
    const [ tokenExpirationDate2, setTokenExpirationDate] = useState()
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = 
        expirationDate || new Date (new Date().getTime() + 1000 * 60 * 60 ) //now plus 1hre
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem('userData', JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate.toIsOString})) //storing token in browser
     
    }, []); //callback wrapped to prevent unnecessay creation of login that leads to loops so it tracks the creation
    //empty dependency once again mean this will never be created becasue no dependencie is tracked to effect any change
    
   
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null)
      setUserId(null)
      localStorage.removeItem('userData'); //remove the userdata on log out
    }, []);
  
  
    //auto 
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData')) //going to the local storage to find item by id
      if (
        storedData &&  //if we get the storedData and the token create a date with storedData.expiration time is not due
        storedData.token && 
        new Date(storedData.expiration) > new Date()
        ){
       login(storedData.userId, storedData.token, new Date(storedData.expiration)) //go ahead and login along with the token; userId and the expiration date
      }
   }, [login])
  
   
  //logout user automatic
   useEffect(() => {
    if (token && tokenExpirationDate2){
      const remainingTime = tokenExpirationDate2.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
   }, [token, logout, tokenExpirationDate2])


   return {login, logout, token, userId}
  
}