import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":

      let formIsValid = true; //something has been entered
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]){
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };

    default:
      return state;
  }
};


export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    //initial states
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  //dispatch was supposed to get our data values from the input fields and save in formState
  //but we needed to wrap it in a callback so we use another fn to wrap it and return that i
  //instead of the dispatch rather
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []); //you could add dispatch or not

  //set form data is also a dispatch ie a fn that takes values and save in formState 
  //but wrapped bc we wanted to use a callback 
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    }); 
  }, []);

  return [formState, inputHandler, setFormData]; //hooks can return {}, [], and '' it doesnt matter
};
