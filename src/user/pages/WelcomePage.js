import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import './Auth.css';
import {Link} from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';

const Welcome = () => {
  
  

  return (
    <React.Fragment>
      
      
      <Card className="authentication">
    
        <h3>Codzienne zdjęcia/wpisy.</h3>
        <hr />
        
        <Link to="/auth">
          <Button type="submit">
          
          <h3>ZALOGUJ</h3>
        
          </Button>
          </Link>
    
        
        
         
      </Card>
    </React.Fragment>
  );
};

export default Welcome;
