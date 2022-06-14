import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      address: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        // setFormData(
        //   {
        //     title: {
        //       value: responseData.place.title,
        //       isValid: true
        //     },
        //     description: {
        //       value: responseData.place.description,
        //       isValid: true
        //     }
        //   },
        //   true
        // );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
     const request= await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          description: formState.inputs.description.value,
          address: formState.inputs.address.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      let response = request.place;
      console.log('place', response)


      history.push('/places');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          {/* <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          /> */}
          <Input
            id="description"
            element="textarea"
            label="Opis do zdjęcia:"
            validators={[VALIDATOR_MINLENGTH(2)]}
            errorText="Wpisz minimum 2 litery."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
              <Input
          id="address"
          element="input"
          label="Rubryka poniżej jest na wpis gdzie zdjęcie(lub wpis) było zrobione. Wystarczy wpisać cokolwiek i powinno wyszukać na mapie (dla dokładnego wyszukiwania użyj formatu: ul.Ulica 5, Miejscowość, lub bez interpunkcji: ul ulica 5 miejscowosc; ważne żeby użyć skrótu słowa ulica a nie całego wyrazu). Jeśli chce się zmienić rezultaty wyszukiwania na mapie wystarczy kliknąć przycisk 'ZMIEŃ' pod dodanym zdjęciem. GDZIE:"
         
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Musisz wypełnić pole powyżej żeby kontynuować."
          onInput={inputHandler}
          initialValue={loadedPlace.address}
          initialValid={true}
          
        />
          <Button type="submit" disabled={!formState.isValid}>
            UAKTUALNIJ
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
