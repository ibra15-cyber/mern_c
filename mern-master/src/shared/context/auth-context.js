import { createContext } from "react";


export const AuthContext = createContext({

    userId: null, //managing creator created at the backend
    isLoggedIn: false,
    token: null,
    login: () => {},
    logout: () => {}

});

//can be used to feed any part of our code that needs it
//once it changes it affect all the places
//no props require to get the data along

   