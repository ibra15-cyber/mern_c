import React, { useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { DUMMY_PLACES } from "./UserPlaces";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";

import {useHttpClient} from '../../shared/hooks/http-hook';
import "./UpdatePlace.css";

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';

export const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  
  const [loadedPlace, setLoadedPlace] = useState(); //this will save our place obj
  const placeId = useParams().placeId;           //this will get us the placeId from the request

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // const history = useHistory(); //using this for redirect; just like redirect in django
  const navigate = useNavigate();

  //destructuring this data from useForm
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        val: "",
        isValid: false,
      },
    },

    false
  );


  //get request ie getting the data first before we modify it
  //our data will be saved in loaded places fn
  useEffect(()=> {

    const fetchPlace = async () => {
        try {
            const responseData = await sendRequest( `
            process.env.REACT_APP_BACKEND_URL + /places/${placeId}` //fitering our particular place
             );

            setLoadedPlace(responseData.place) //saving it to loadedplace; not all but just place part

            //show us back our data through setFormData
            setFormData(
              {
                title: {
                  value: responseData.place.title, //get us the title from the particular place we got using it id
                  isValid: true,
                },
                description: {
                  value: responseData.place.description,
                  isValid: true,
                },
              },
              true
            );

        } catch (err) {

        }
    };

    //calling our fn that runs the above; ie go about fetching our data 
    fetchPlace(); //we are calling fetch place where to go to the url and request for a place; we then pass the place to a usestate to which was empty initilaly
}, [sendRequest, placeId, setFormData]) //update our responseData.place anytime any of this change


  // const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId); //we imported dummy_places from userplaces

  // useEffect(() => {
  //   if (identifiedPlace) { //the ! infront of this gave me another headache
  //     setFormData(
  //       {
  //         title: {
  //           value: identifiedPlace.title,
  //           isValid: true,
  //         },
  //         description: {
  //           value: identifiedPlace.description,
  //           isValid: true,
  //         },
  //       },
  //       true
  //     );
  //   }
  //   setIsLoading(false);
  // }, [setFormData, identifiedPlace]); //both dependencies will not change though, the first is static but the second is prevented using useCaller





  //here we are saying send to the url our form data saving back our edit to db
  //just as i predicted, we both do a get to get back our fields and then after editing it we save just like creation but here we just savee
  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({ //we don't need to send image, a binary, hence we use Json and not FormData()
          title: formState.inputs.title.value, //formState not loaded so the edited file
          description: formState.inputs.description.value
        }),
        {
          //more than one header
          'Content-Type': 'application/json',
           Authorization: 'Bearer ' + auth.token 
        } 
      );
      // history.push('/' + auth.userId + '/places'); //take us back /user/places where we got got the edit in the first place
    navigate('/' + auth.userId + '/places' )
    } catch (err) {}                                //initially set to null in auth-contx but since we are logged in, it can get our id
  };



   if (isLoading) {
    return (
      <div className="center">
        {/* <h2> Loading... </h2> */}
        <LoadingSpinner />
      </div>
    );
  }

  
  //if the user place not found and no error message recieved ; create an error message
  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card >
          <h2>Could not find a place!</h2>
        </Card>
      </div>
    );
  }



  

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && ( //if we are not loadding but have a loaded place from our responsedata passed to setLoadeddata
        //edited code for it to first check title value exist before it renders
    //i fear this would never render becasue already i have been struggling to get to work
        
        // render a a form with this fields 
        // intialvalue holds the data we got from the get request; ie render with our initial data 
        
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          label="Title"
          type="text"
          validtors={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputHandler} 
          // initialValue={formState.inputs.title.value}
          initialValue={loadedPlace.title} //give us the initial title
          // initialValid={formState.inputs.title.isValid}
          initialValid={true}
        />
        
        <Input
          id="description"
          element="textarea"
          label="Description"
          validtors={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          // initialValue={formState.inputs.description.value}
          initialValid={true}
          // initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}> UPDATE PLACE </Button>
      </form>
      
      )}
    </React.Fragment>
  );
};

//update places is also a form just like add places
//but ofcourse with update we call the same thing and edit it so it will be rendered throught the edit button
//already we have stated that on click on the EDIT button in PlaceItem to route to {`/places/${props.id}`} ie 
//places.:id for diff places that needs editing
//so onclicking this button we are routed to places.id
//remember this is only possible because becasue we wraped NavLinks as props in th Button component


//as usual we use useParams to get the dynamic places on placeId which is defined in App routing
//here we use the method find to find those id's with the same placeId ie only the the same place is found and saved as
//identifiedPlace

//we call our custom useForm to control states
//passing or destructuring our param formState, inputHandler, setFormData
//formState refers to the initial data
//setFormData to update data
//input handler to change our input all done in our hook


//we use useEffect to track changes in both setFormData and identifiedPlaces that change as dependencies.
//but we only update if the identifiedPlace is found and same


//we created a useState that takes isLoading and setLoading with default as true
//when loading show a text is loading
//so when setFormData runs and changes it shouuld turn off setLoading ie it should show
//if we find the a place, render a form with 2 inputs else say nothing found

//our form will submit on submit we want it to close
//then send the data to console until to find a backend
