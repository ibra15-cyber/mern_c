import React, {useContex} from "react";
import { useForm } from "../../shared/hooks/form-hook";

import Input from "../../shared/components/FormElements/Input";

import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./PlaceForm.css";
import Auth from "../../users/pages/Auth";
import { clear } from "@testing-library/user-event/dist/clear";

import { useNavigate } from 'react-router-dom'
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {

  // const history = useHistory();
  const navigate = useNavigate()

  const auth = useContex(AuthContext) //getting our context to use user id
  //destructure formState and inputHandler from useform
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );

  // const titleInputHandler = useCallback((id, value, isValid) => {}, []);
  // const descriptionInputHan dler = useCallback((id, value, isValid) => {}, []);
  const { isLoading, error, sendRequest, clearError } =   useHttpClient();
 

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs.title.value);
    try{

      //defining our collection or body to submit. we got this from our form
      const formData = new FormData()

      formData.append('title', formState.inputs.title.value,);
      formData.append('description', formState.inputs.description.value,);
      formData.append('address', formState.inputs.address.value,);
      // formData.append('creator', auth.userId); //user id gotten form auth-context and not from the form
      // not used anymore because we tap the id from generated token
      formData.append('image', formState.inputs.image.value,);

      //here we are not saving it because we dont need it, we are sending our data
       await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/places',
         'POST' , 
          formData,
          { Authorization: 'Bearer ' + auth.token}   //auth from the auto-context
        );
    // history.push('/') //redirect to home
    navigate('/')
    } catch (err){

    }
   
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {/* this element is the custom from Input component */}
        {isLoading && <LoadingSpinner asOverlay />} {/*** if we are loading give us the spinner */}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title "
          validators={[VALIDATOR_REQUIRE()]} //takes nothing and return an object with key, type = validator_type_require which is a variable with a string 'REQUIRE'
          errorText="Please enter a valid title "
          onInput={inputHandler} //defining our props.onInput in the Input file
        />
        <Input
          id="description"
          element="textarea"
          label="Description "
          type="text"
          validators={[VALIDATOR_MINLENGTH(5)]} //validator_minl is fn that takes a value then assign that val to val and also has a type minlength that takes a string 'min_length"
          errorText="Please enter a valid description at least 5 characters"
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address "
          validators={[VALIDATOR_REQUIRE()]} //takes nothing and return an object with key, type = validator_type_require which is a variable with a string 'REQUIRE'
          errorText="Please enter a valid address."
          onInput={inputHandler} //defining our props.onInput in the Input file
        />

        {/* display our image upload  */}
        <ImageUpload id='image' center onInput={inputHandler} errorText="please provide an image" />

        <Button type="submit" disabled={!formState.isValid}> ADD PLACE </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;

//we returning a form with an Input that is customize and control by props.element
//when props.element is given input it displays input tag else it displays textarea
//so here we used 2 Inputs which means we want twice of the <Input component rendering diff
//because of the diff conditions.
//
