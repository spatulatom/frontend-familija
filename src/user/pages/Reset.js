import React, { useState } from 'react';


import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import SuccessModal from '../../shared/components/UIElements/SuccessModal';


import { useHttpClient } from '../../shared/hooks/http-hook';
import './Auth.css';

const Reset = () => {
  
  const [email, setEmail] = useState('');
  const [valid, setValid] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [success, setSuccess]= useState();

  

  const emailHandler = event=>{
      setEmail(event.target.value);
      const at = "@"
     if(event.target.value.includes(at)){
        setValid(true)
     }
  }
    
      

  const authSubmitHandler = async event => {
    event.preventDefault();

    
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/reset',
          'POST',
          
          JSON.stringify({
            email: email,
            
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        setSuccess(responseData.message);
        setEmail('')
      } catch (err) {}
    } 
    const clearSuccess = () => {
        setSuccess(null);
      };
    

  return (
    <React.Fragment>
      <SuccessModal success={success} onClear={clearSuccess}/>  
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>E-mail:
        </h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          <input type="email" id="email" name="email" value={email} onChange={emailHandler}/>
          <Button type="submit" disabled={!valid}>
            WYŚLIJ
          </Button>
        </form>
        
        
         
      </Card>
    </React.Fragment>
  );
};

export default Reset;
