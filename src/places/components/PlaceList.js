import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const PlaceList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card className="place-list__empty-list">
          <h2>Jeszcze nie masz nowych postów. Może chcesz utworzyć?</h2>
          <Button to="/places/new">Utwórz</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
          date={place.date}
          creator={place.creator}
          name={place.creatorName}
          comments={place.comments}
          creatorImage={place.creatorImage}
          likes={place.likes}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
