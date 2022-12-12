import React from "react";
import { BrowserRouter, Route, Navigate, Routes} from "react-router-dom";

import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import { UpdatePlace } from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";
import Register from "./users/pages/Register";
import { AuthContext } from "./shared/context/auth-context";

import './shared/components/Navigation/MainHeader.css'
import  { useAuth } from './shared/hooks/auth-hook.js'
 

function App() {
const {login, logout, token, userId} = useAuth()
  // const [userId, setUserId] = useState(false) //tracking the creator 
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [token, setToken] = useState(false);

  // const [ tokenExpirationDate2, setTokenExpirationDate] = useState()

  // const login = useCallback((uid, token, expirationDate) => {
    // setToken(token);
    // setUserId(uid);
    // const tokenExpirationDate = expirationDate || new Date (new Date().getTime() + 1000 * 60 * 60 ) //now plus 1hre
    // setTokenExpirationDate(tokenExpirationDate);
    // localStorage.setItem('userData', JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate.toIsOString})) //storing token in browser
   
  // }, []); //callback wrapped to prevent unnecessay creation of login that leads to loops so it tracks the creation
  //empty dependency once again mean this will never be created becasue no dependencie is tracked to effect any change
  
 
  // const logout = useCallback(() => {
    // setToken(null);
    // setTokenExpirationDate(null)
    // setUserId(null)
    // localStorage.removeItem('userData'); //remove the userdata on log out
  // }, []);


  //auto 
  // useEffect(() => {
    // const storedData = JSON.parse(localStorage.getitem('userData')) //going to the local storage to find item by id
    // if (
//       storedData &&  //if we get the storedData and the token create a date with storedData.expiration time is not due
//      storedData.token && 
//       new Date(storedData.expiration) > new Date()
//       ){
//      login(storedData.userId, storedData.token, new Date(storedData.expiration)) //go ahead and login along with the token; userId and the expiration date
//     }
//  }, [login])

 
//logout user automatic
//  useEffect(() => {
//   if (token && tokenExpirationDate2){
//     const remainingTime = tokenExpirationDate2.getTime() - new Date().getTime();
//     logoutTimer = setTimeout(logout, remainingTime)
//   } else {
//     clearTimeout(logoutTimer)
//   }
//  }, [token, logout, tokenExpirationDate2])

  let routes;
  //either import Auth

  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        {/* <Route path="/register" element={<Register />} /> mine */}
        <Route path="/places/new" element={ <NewPlace /> } />
        <Route path="/places/:placeId" element={ <UpdatePlace /> } />
        <Route path="/auth" element={<Navigate to="/" />} />
        {/* <Navigate to="/auth" replace /> */}
        {/* <Route path="/auth" element={user ? <Navigate to="/" replace /> :  <Login />}  /> */}
        {/* redirect to route when you get stuck anywhere, wrong page */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </React.Fragment>
    );
  } else {

    // when we are not log in; give guest routes access 
    routes = (
      <React.Fragment>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="*" element={<Navigate to="/auth" />} /> */}
      </React.Fragment>
    );
  }

  return (
    // autocontext below giving all the pages our values and track their changes
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId}} >
      <BrowserRouter>

        <MainNavigation />

        <main className="main">
          <Routes>{routes}</Routes>
        </main>

      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

//install react-router-dom
//use Browserrouter, then route with elements
//then for redirection state the path and where to go

//our AuthContext is now seen by all routes
//so in our default create context file
//we wanted a context with 3 fns the default of which is false
//then we need another login and logout
//we call it here and create arguements to pass our values through the provider
//we use useState to track isloggin which we said to be false by default
//then we turn it on with login and off with logout
//so now all routes can see

//we formatted some routes to be available when isLoggedIn is true ie when we are logged in
//and others when we are not.
//'/register is mine
