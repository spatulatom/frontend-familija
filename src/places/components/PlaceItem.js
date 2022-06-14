import React, { useState, useContext} from 'react';
import { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';
import Comments from './Comments';
import Likes from '../../shared/components/UIElements/Likes'


const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [image, setFullImage] = useState(false);

  // formatting new Date into shorter string, no 
  // need for it now with backend formatting:

  // let date;
  //   if(props.date){
  //     date=props.date;
    // date = props.date.toString().split(' ').splice(0,5).join(' ')}

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  const imageZoom = (event)=>{
    console.log('Click!!',event.target);
    setFullImage(prev=>!prev)
  }



  // code for checking for link in a post
  // comments regarding comparison between jsx and SenGrid syntax:
  // in SendGrid you can input <a> into html and is rendered as link;
  // in jsx tah dosent work
  // so i am extracting link, firs not returning it in new array then 
  // assing it to link and renderng separetly in a jsx below

  let description;
  let url= "https:";
  let link;

  if(props.description.includes(url)&&props.description.indexOf(' ') <= 0){
      description = <a href={props.description}>Kliknij tutaj</a>;
  
    }else if(props.description.includes(url)&&props.description.indexOf(' ') >= 0){
          
          description = props.description.split(' ').map(word=>{
          if(word.includes(url)){
          // becuse im not returnig here we wont see that in a new array
          word = <a href={word} target="_blank" rel="noopener noreferrer">kliknij tutaj </a>;
          link= word;
    
          }else{
              return word
            }}).join(' ');        
    }else{
        description = props.description;
      }
      
  
  let displayImage;
  if(props.image==='decoy-image'){
      
         displayImage = 
              <div className="post-item__info">
                  <p className="post-item_description">{description} {link}</p>
                  <div className="place-item__info">
                  
                      <span className= "place-item__avatar"><img src={props.creatorImage} alt="profile"/></span>
                  
                  
                      <span className='place-item__name'>{props.name}</span>
                  
                  
                      <span className='place-item__date'>{props.date}</span>
                  </div>
                  {/* <p className="post-item_description">{description} {link}</p> */}
              </div>
              
  
  }else{
displayImage =  
       <div>
       
            <div className={image?"place-item__image background":"place-item__image"}>
              <img className={image? 'full_image' : ''}
                src={props.image}
                // src={`http://localhost:5000/${props.image}`}
                alt={props.title}
                onClick={imageZoom}/>
            </div> 
            <div className="place-item__info">
            
                <span className= "place-item__avatar"><img src={props.creatorImage} alt="profile"/></span>
            
            
                <span className='place-item__name'>{props.name}</span>
          
                <span className='place-item__description'> {props.description}</span>
                <span className='place-item__date'>{props.date}</span>
            </div>
            
            
      </div>
      }


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        className="place-item__map"
        headerClass="place-item__map"
        contentClass="place-item__modal-content"
        footerClass="place-item__map"
        footer={<Button onClick={closeMapHandler}>ZAMKNIJ</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Jesteś pewien/a?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              ANULUJ
            </Button>
            
            <Button danger onClick={confirmDeleteHandler}>
              USUŃ
            </Button>
          </React.Fragment>
        }
      >
        {/* <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p> */}
        <p>Czy chcesz kontynuować i usunąć zdjęcie/wpis? </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
         {/* <div className="place-item__image">
            <img className={image? 'full_image' : ''}
            src={props.image}
              // src={`http://localhost:5000/${props.image}`}
              alt={props.title}
              onClick={imageZoom}
            />
          </div>  */}
          {displayImage}

          {/* <div className="place-item__info">
           
            <p className='place-item_description'>{props.description}</p>
            <p >Dodane przez:  {props.name}</p>
            <p>{props.date}</p>
          </div> */}
          <Likes placeId={props.id} likes={props.likes}/>

          <div className="place-item__actions">
            <Button danger onClick={openMapHandler}>
              GDZIE
            </Button>
            {auth.userId === props.creatorId && (
              <Button danger to={`/places/${props.id}`}>ZMIEŃ</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                USUŃ
              </Button>
            )}
          </div>
             
        </Card>
        
      </li>
      <Comments id={props.id} comments={props.comments}/>
    </React.Fragment>
  );
};

export default PlaceItem;
