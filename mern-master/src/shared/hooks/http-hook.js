import {useState, useCallback, useRef, useEffect} from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(); //undefine
    const activeHttpRequests = useRef([]); //ref data that will not change

    // const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const sendRequest = useCallback (async (url, method='GET', body=null, headers = {}) => {
        setIsLoading(true) //start loading
        //before sending request
        const httpAbortCrtl = new AbortController();    //default in modern browsers
        activeHttpRequests.current.push(httpAbortCrtl);  //working behind the scene
        try {
            const response = await fetch(url, {
                method, //where we use sendRequest without stating this, it uses GET by default
                body,   //the body is null so in GET request we dont need to pass a body item
                headers,   //sometimes too neither the header. in post those are expected
                signal: httpAbortCrtl.signal //use it to cancel request
            });
    
            const responseData = await response.json() //get the json response which was stated at each of the controllers to res.json
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCrtl)
            
            if (!response.ok){ //in case there was a response, but it wasn't 200 catch the error; ie 500 and that is not technically an error should be catched
                throw new Error(responseData.message) //throw end's execution 
            } 

            setIsLoading(false) //if we a successfull in getting here, then we got 200; so stop spinning
            return responseData; //and give us back the data; in case theres other erros like netowrk catch it below
        } catch (err){
            setError(err.message);
            setIsLoading(false) //and stop spinning
            throw err //stop the progress
        }

        // setIsLoading(false)
       
    }, []) //using usecallback to prevent it from recreating itself, so sendrequest runs once. when we gets called

    const clearError = () => { //clear the error
        setError(null)
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        };
    }, []);


    return { isLoading, error, sendRequest, clearError} //returning object can be alist  this are items we sending anytime sendRequest is used

}