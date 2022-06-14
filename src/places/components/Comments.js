import React, { useContext, useEffect, useState, useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Comments.css';

const Comments = (props) => {
  const auth = useContext(AuthContext);
  const [submitted, setSubmitted] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [comments, setComments]= useState(props.comments);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: 'description',
        isValid: true
      },
      address: {
        value: 'adress',
        isValid: true
      },
      image: {
        value: null,
        isValid: true
      }
    },
    false
  );


  // const history = useHistory();
  
console.log('isLoading', isLoading)
  const commentSubmitHandler = async event => {
    event.preventDefault();
    try {
     const responeData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/comments`,
        'POST',
        JSON.stringify({
          description: formState.inputs.title.value,
            placeId: props.id
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      let response = responeData;
      setComments([...comments, response]);    
      inputHandler("title", '', false);
      console.log( 'response', response);
      setSubmitted(prev=>!prev)
      setTimeout(()=>{
        setSubmitted(prev=>!prev)
      }, 2000)

      // history.push('/');
    } catch (err) {}
  };
  
console.log('comment', comments)
  let comment;
  if(comments.length===0){
    // comment= <p className="no-comments">Nikt jeszcze nie dodał komentarza.</p>
    comment='';
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <form className="place-form-comments" onSubmit={commentSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay/>}
        
        {/* <h4 className="comments-header">Komentarze:</h4> */}
        {comments.map(comment=>
            <div>
                <p className= "comments">{comment.date}, <span className='comments_name'>napisał/a {comment.addedBy}:</span> </p>
              
                  <p className = "comments"> <span className='comments-description'> ━  {comment.description}</span></p>
            </div>

           )}
            {comment}

            <Input
          id="title"
          element="input"
          type="text"
          label="Skomentuj:"
          validators={[VALIDATOR_MINLENGTH(2)]}
          errorText="Wpisz minimum dwa znaki."
          onInput={inputHandler}
          formSubmitted={submitted}
        
        />
       
        <Button type="submit" disabled={!formState.isValid}>
          DODAJ
        </Button>
      </form>
      
      
    </React.Fragment>
  );
};

export default Comments;
// thanks
