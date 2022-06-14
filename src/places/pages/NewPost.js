
import React, { useContext } from 'react';
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
import './PlaceForm.css';

const NewPost = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: 'title',
        isValid: true
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: 'false',
        isValid: true
      },
      image: {
        value: null,
        isValid: true
      }
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async event =>  {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/posts`,
        'POST',
        JSON.stringify({
          description: formState.inputs.description.value,
          address: formState.inputs.address.value

        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
       
        <Input
          id="description"
          element="textarea"
          label="Poniżej miejsce na zwykłe wpisy w stylu 'co słychać':"
          validators={[VALIDATOR_MINLENGTH(2)]}
          errorText="Wpisz wyżej minimum 2 znaki."
          onInput={inputHandler}
        />
         <Input
          id="address"
          element="input"
          label="Gdzie:"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Wpisz powyzej adres zeby kontynuowac."
          onInput={inputHandler}
        />
       
       
        <Button type="submit" disabled={!formState.isValid}>
          DODAJ
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPost;
