 import React, {useRef, useEffect, useState } from 'react'

import './ImageUpload.css'
import Button from './Button'

 const ImageUpload =  (props) => {
    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)


    //using useRef to establish connection to a dom element and also 
    //another use of it is to save some value that survives rerender 
    const filePickerRef = useRef(); 


    //to monitor change when file change
    //the setFile got us our file and we save it to file
    //now if life change 
    useEffect(()=> {
        if(!file){
            return;
        }

        //if we got a file and not invalid as above
        //save it to default brwoser file mananger
        //used to convert binary as in our image 
        const fileReader = new FileReader(); //from the browser for reading files


        fileReader.onload = () => { 
            setPreviewUrl(fileReader.result) //set the image but save it as setPreview ie in preview
        }


        fileReader.readAsDataURL(file) //loading our file. bc it doesnt have a promise we handle it before it gets here

    }, [file])


    

    //when we click on a button get us the file ie upload
    const pickImageHandler = () => {
        filePickerRef.current.click(); 
    }

    //if a user get file save it it setfile and setisvalid true
    //so as to be able to take it to the backend

    const pickedHandler = (event) => {
        // console.log(event.target)
        let fileIsValid = isValid
        let pickedFile;
        if (event.target.files && event.target.files.length === 1 ) { //we have a file and its just 1
            pickedFile = event.target.files[0] //get that file

            setFile(pickedFile) //save the file

            setIsValid(true);    //confirm
            fileIsValid= true;
        } else {
            setIsValid(false) //we didnt get the file  
            fileIsValid = false;
        }
        
        //forward this variables incase  we got a file 
        props.onInput(props.id, pickedFile, fileIsValid)
    }



    return (
        //styling like this is global and not tired to any spececfic class or id
        <div className="form-control">
        {/* //     we need a to upload image, hence we use the input type file, we use inline styling to turn it off by default
        //     on onchanged track where we got the file
        //     if we do we save it in a setfile in the pickedhandler fn */}

            <input type='file' id={props.id} style={{display: 'none'}}  accept=".jpg, .png, .jpeg" onChange={pickedHandler} ref={filePickerRef} /> 
            
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {/* if setPreview gets our file; it then saves in previewUrl
                    so if we got it pass it as the image source */}
                    {previewUrl && <img src={previewUrl} alt="Preview" />} 
                    {!previewUrl && <p>Please pick an image. </p>}
                </div>

                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>

            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
 }

 export default ImageUpload