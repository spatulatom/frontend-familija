// import { useCallback, useReducer } from 'react';

// const formReducer = (state, action) => {
//   switch (action.type) {
//     case 'INPUT_CHANGE':
//       let formIsValid = true;
//       for (const inputId in state.inputs) {
//         if (!state.inputs[inputId]) {
//           continue;
//         }
//         if (inputId === action.inputId) {
//           formIsValid = formIsValid && action.isValid;
//         } else {
//           formIsValid = formIsValid && state.inputs[inputId].isValid;
//         }
//       }
//       return {
//         ...state,
//         inputs: {
//           ...state.inputs,
//           [action.inputId]: { value: action.value, isValid: action.isValid }
//         },
//         isValid: formIsValid
//       };
//     case 'SET_DATA':
//       return {
//         inputs: action.inputs,
//         isValid: action.formIsValid
//       };
//     default:
//       return state;
//   }
// };

import { useCallback, useReducer } from 'react';

// hooks are normal JS functions, er convention they alaways start with 
// lower case 'use';
// lets say in anotehr component you have a fetch block and in then you
// wouuld like to called useForm and initilize your state with the fetched
// data - there is a rule though when it comes to hooks that they must only be called
// directly in your component function, must not use them inside of if blocks, loops
// or inside of other functions including  then blocks - the idea is that you 
// set up your state early in the first render (what about when we fatch data in the 
// firs render? )
const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;

          // this else statement below?
          // for one thing when in Auth.js we have name: undefined, without 
          // the very first if on top what happens is :
          // wehn name: undefined the propery is still tehnically part
          // of the form object the value of it just as undefined, but since its stil its part
          // in the form hook in the 'INPUT CHANGE' case, we still find this name 
          // input as an input, value jus as undefined but the property is still there
          // and we check if its truthy, or in our case falsy and undefined is falsy so 
          // we add continue - this basically means that we finish right there te iteration of the
          // loop/and we go to the next iteration

        } else {
          // ok i get it if the block above is falsy meaning that there isn no action.inputId
          // like we have 'nmae', email, password so if we had action.inpuId= surname, and obviously
          // we dont have that in our state that we are loopin through, we jus jump below
          // and set the formValidity based on that isValid value, 
          // that would suggest thoug that we are set up to handle the case that 
          // we hava a state like ....state, name: password { value: 1234., isValid: true/false}
          // and np action has reached it with input handler since the above input===action.inputId
          // hasnt kicked in, but yet we still want to see its isValid propertu and based on it we 
          // want to set our overall formValidity
          // So that cae we had in our Comments.js for example, where there is big state 4 properties
          // /and we only use title so since the rest of them has isValid set to true we can proceed
          // becuse of what happens in this block, it the isValid of those not really needed 
          // properties was false teh overall validity would also be false
          // Anyways it nice to have this extra layer of security i think i should be rare
          // thoug and the state should reflect what what the input handler can get
          // or maybe not, 
          // I am wrong this sectio 'else' block simply handle all teh cases when input hndler is 
          // called and has to change only one property of the state whant is actually always 
          // the csde since we have onChange in action and we changin state not only based on 
          // input field(one propery) but every keystroke, so there is always all but one
          // properties that we loop throuh the state and they are not in input?handelr- inputId
          // so : !inputId === action.inputId and we go here 
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      };
    case 'SET_DATA':
      return {
        // we are setting new state overwriting the old one so we dont want
        // to copy the old one - important, we dont want the new one merged with the 
        // existing one 
        inputs: action.inputs,
        isValid: action.formIsValid
      };
    default:
      return state;
  }
};
  

// state should now live inside of a hook that is in genreal 
// meant to be reused in different components so we can pass state here
// as an argument
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);
// we will return an array but you can return object, string - hooks
// dont have to return arrays 
  return [formState, inputHandler, setFormData];
};

// export const useForm = (initialInputs, initialFormValidity) => {
//   const [formState, dispatch] = useReducer(formReducer, {
//     inputs: initialInputs,
//     isValid: initialFormValidity
//   });

//   const inputHandler = useCallback((id, value, isValid) => {
//     dispatch({
//       type: 'INPUT_CHANGE',
//       value: value,
//       isValid: isValid,
//       inputId: id
//     });
//   }, []);

//   const setFormData = useCallback((inputData, formValidity) => {
//     dispatch({
//       type: 'SET_DATA',
//       inputs: inputData,
//       formIsValid: formValidity
//     });
//   }, []);

//   return [formState, inputHandler, setFormData];
// };