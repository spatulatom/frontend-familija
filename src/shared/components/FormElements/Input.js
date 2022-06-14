import React, { useReducer, useEffect, useCallback } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  // in this function we always have to return new state
  switch (action.type) {
    case 'CHANGE':
      // state dosent have to be an object in our case it is:
      return {
        // first we will create a copy of our existing state so we dont loose
        // any data
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
      case 'RESET':
      // state dosent have to be an object in our case it is:
      return {
        // first we will create a copy of our existing state so we dont loose
        // any data
      
        value: '',
        isValid: false
      };
      
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      };
    }
    // in case we dispatch some action we dont handle explicitly 
    // then we will just make it here
    default:
      return state;
  }
};

const Input = props => {
  // just like useState useReducer returns something and just like useState
  // it return ana array with exactly two elemenents, so just like with useState
  // we can use array destructuring to get these two elements out of that array and 
  // store them in constants, and the two elements we always get from useReduser
  // no matter how we configure useReducer is the current state - we name it:
  // inputState, and a dispatch function which we can call
  const [inputState, dispatch] = useReducer(inputReducer, {
    // initil value matters for example with the case of UpdateState
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });
;

  // we pullin only what we want to use from props as dependency,
  // the same with the state as for example we dont need useEffect run 
  // when isTouched is changed
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
 
    onInput(id, value, isValid);    
  }, [id, value, isValid, onInput]);

  const changeHandler = event => {
    console.log('change');
    // changeHandler is fired on every keystroke- becuse is tied to onChange
    // event listenser down below, so on every keystroke we want to store the 
    // value and validate it;
    // when you manage two states and they are connected you can use two useState
    // or often in that case when there is connection - the validity depends on 
    // the input value- then using useReducer is better; 
    dispatch({
      
      type: 'CHANGE',
      // if state wasnt object i wonder how would this dispatch look like as it 
      // seems that change is part of that state object
      val: event.target.value,
      validators: props.validators
    });
  };
  
  
  const resetHandler = () => {
    console.log('reset');
    // changeHandler is fired on every keystroke- becuse is tied to onChange
    // event listenser down below, so on every keystroke we want to store the 
    // value and validate it;
    // when you manage two states and they are connected you can use two useState
    // or often in that case when there is connection - the validity depends on 
    // the input value- then using useReducer is better; 
    dispatch({
      type: 'RESET',
  
    });
  };
 

  // with onBlur below touchHandler and the state obviously we can make the
  // input 'not red' atthe very start, beacuse at the very start tehnically 
  // it meets condition of !isValid, yet we want to give the user a chance
  // to input some value before the input window goes red 
  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  if(props.formSubmitted){
    if(value===''){
      return true;
      
    }else{
    resetHandler();}
  }

  

  const element =
    props.element === 'input' ? (
    
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${!inputState.isValid &&
        inputState.isTouched &&
        'form-control--invalid'}`}
    >
      {/* just like we have className in React not class, htmlFor is translated to for
      since for apparently is a keyword in React */}
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
