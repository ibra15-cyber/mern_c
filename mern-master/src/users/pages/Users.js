import React, {useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import UserItem from "../components/UserItem";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  
  const USERS = [
    {
      id: "u1",
      name: "Max Schwarz",
      image:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fperson&psig=AOvVaw3JT3V1QSQYdhio611_U3IF&ust=1670462214109000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCNDc-Omq5vsCFQAAAAAdAAAAABAE-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/526.jpg",
      places: 2,
    },
    {
      id: "u2",
      name: "Ali Kalamu 2",
      image:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fperson&psig=AOvVaw3JT3V1QSQYdhio611_U3IF&ust=1670462214109000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCNDc-Omq5vsCFQAAAAAdAAAAABAEloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/526.jpg",
      places: 5,
    },

  ];

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(); //undefine
  const { isLoading, error, sendRequest, clearError } =   useHttpClient(); //replaces the above

  const [loadedUsers, setLoadedUsers] = useState();


  // useEffect(() => { //async and promise not needed by useEffect because they add a promise
  //   const fetchUsers = async () => { //using async on sendRequest rather
  //     setIsLoading(true) //start spining

  //     try {
  //       const response = await fetch("http://localhost:5000/api/users");

  //       const responseData = await response.json(); //get the json data

  //       if(!response.ok) { //it's not 200 but other codes that are not stopped as error
  //         throw new Error(responseData.message)
  //       }

  //       setLoadedUsers(responseData.users) //the users here is the one received in user controller
      

  //       }catch (err) { 
  //         setError(err.message);
  //     }

  //     setIsLoading(false);
  //   } //end sendRequest() 
  //   fetchUsers();   //then call it
  // }, [] ) //only runs ones



  // const errorHandler = () => {
  //   setError(null)
  // }

  useEffect ( () => {

    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          // 'http://localhost:5000/api/users'
          process.env.REACT_APP_BACKEND_URL + "/users"

          // `${process.env.REACT_APP_BACKEND_URL}/users`
        );

        setLoadedUsers(responseData.users) //give me the users in the received json fil

      } catch (err) {

      }
    }

    fetchUsers(); //returning our ftetch places ie our users and we saved it in loadedUsers
  }, [sendRequest]) //when the gotten data changes , update us


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} /> 

      { isLoading && (
      <div className="center">
        <LoadingSpinner />
      </div>
      )}
      
    {!isLoading && loadedUsers && <UsersList users={loadedUsers} />} 
    
    {/* if its not loading and we got loadedUsers then pass it to userslist and render it */}

    {/* used by our hardcoded users list  */}
    {/* <UsersList users={USERS} />  */}

    </React.Fragment>
  );
};

export default Users;
