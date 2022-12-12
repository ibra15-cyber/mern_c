import React, {useEffect, useState} from "react";
import {useParams, NavLink } from 'react-router-dom'
import { useHttpClient } from "../../shared/hooks/http-hook";

import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import isLoading from '../../shared/components/UIElements/LoadingSpinner'

import PlaceList from '../components/PlaceList'
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

export const DUMMY_PLACES = [  
    {
        id: 'p1',
        title: "Empire State Building",
        description: "One of the most famous sky scraper in the world!",
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 29th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u1'
    },
    {
        id: 'p3',
        title: "Empire State Building 2",
        description: "One of the most famous sky scraper in the world!",
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 29th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: "2nd State Building",
        description: "One of the most famous sky scraper in the world!",
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 29th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u2'
    },

]
 
const UserPlaces = () => { 
    const  { isLoading, error, sendRequest, clearError}  = useHttpClient();
    const [ loadedPlaces, setLoadedPlaces] = useState();

    const userId = useParams().userId; //the dynamic userid passed at route get them. it cant be called inisde filter, hence create a const.
    //we are not displaying all items but filtering it based on creator
    //so if the creator == userId and creator is u1 u2 passed in the navlink
    // const loadedPlaces = DUMMY_PLACES.filter(place=>place.creator===userId)

    useEffect(()=> {

        //function to get our data 
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/${userId}` //a get request
                 );
                setLoadedPlaces(responseData.places) //save

            } catch (err) {

            }
        };

        //calling our fn
        fetchPlaces();
    }, [sendRequest, userId]) //only change the requesting, when the userid change, 

    //this fn takes an id which is our place id and uses set palace to store our place to loaded place;
    // the idea is it should save only those places other than curretn place
    const placeDeletedHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => 
            prevPlaces.filter(place =>place.id !== deletedPlaceId))  //using place.id 
    }


    return (
    <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {/* <h1>{loadedPlaces.length}</h1> */}
        <PlaceList items={loadedPlaces}  />

        {isLoading && (
            <div className="center">
                <LoadingSpinner/>
            </div>
        )}

        {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} /> }
    </React.Fragment>
    );
};

export default UserPlaces;

//useParams on userId, our dynamic route 