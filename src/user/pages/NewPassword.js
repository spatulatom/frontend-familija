import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import SuccessModal from '../../shared/components/UIElements/SuccessModal';


import { useHttpClient } from '../../shared/hooks/http-hook';
import './Auth.css';

const NewPassword = () => {

    const token = useParams().token;
  
  const [password, setPassword] = useState('');
  const [hidden, setHidden]=useState(true)
  const [valid, setValid] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [success, setSuccess]= useState();


 const toggleShow =()=> {
    setHidden(prev=> !prev);
  }

  const passwordHandler = event=>{
      setPassword(event.target.value);
    if(event.target.value.length>5){
        setValid(true)
    }}
const authSubmitHandler = async event => {
        event.preventDefault();

    
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/newpassword',
          'POST',
          
          JSON.stringify({
            password,
            token,
            
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        setPassword('');
        setSuccess(responseData.message);

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
        <h2>Wpisz nowe hasło (min. 6 znaków):
        </h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          <input type={hidden ? 'password' : 'text'} id="pass" name="password"
          minlength="6" required value={password} onChange={passwordHandler}/>
            <button  type="button" onClick={toggleShow}>Pokaż / Ukryj</button>
    
          <Button type="submit" disabled={!valid}>
            ZMIEŃ HASŁO
          </Button>
        </form>
        
        
         
      </Card>
    </React.Fragment>
  );
};

export default NewPassword;
