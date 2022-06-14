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

const NewPlace = () => {
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
        value: '',
        isValid: true
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      await sendRequest(process.env.REACT_APP_BACKEND_URL+'/places', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        {/* <Input
          id="title"
          element="input"
          type="text"
          label="Tytuł"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        /> */}

        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Wybierz zdjęcie."
        />
        <Input
          id="description"
          element="textarea"
          label="Opis do zdjęcia:"
          validators={[VALIDATOR_MINLENGTH(2)]}
          errorText="Wpisz wyżej minimum 2 litery."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label= "Rubryka poniżej jest na wpis gdzie zdjęcie było zrobione. Wystarczy wpisać cokolwiek i powinno wyszukać na mapie (dla dokładnego wyszukiwania użyj formatu: ul.Ulica 5, Miejscowość, lub bez interpunkcji: ul ulica 5 miejscowosc; ważne żeby użyć skrótu słowa ulica a nie całego wyrazu). Jeśli chce się zmienić rezultaty wyszukiwania na mapie wystarczy kliknąć przycisk 'ZMIEŃ' pod dodanym zdjęciem. GDZIE:"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Trzeba wypełnić pole powyżej żeby kontynuować."
          onInput={inputHandler}
        
        />
      
        <Button type="submit" disabled={!formState.isValid}>
          DODAJ
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
