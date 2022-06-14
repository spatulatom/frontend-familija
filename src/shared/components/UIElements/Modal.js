import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = props => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          // event prevent default here is for slightly different reason than 
          // usually -where usally prevents from page reloding after onSubmit
          // is pressed - in here is to prevent form submission in case we have any 
          // buttons in the form and they are pressed
          // where in that case we have the usuall prevent default placed?
          // maybe there isnt any since in case of modal we dont mind page reload
          // /when the form is submitted?
          // Answer: if we provide our own submit function that is the duty of that
          // function to prevent default
          props.onSubmit ? props.onSubmit : event => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  
  // return ReactDOM.createPortal(content, document.getElementById('modal-hook'));-original
  return content;
};


// basically we need those two components because we want to play a transition here
// and a backdrop
const Modal = props => {
  const modal = (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        // appropite classNames will be added in modal.css not like in case
        // of sidedrawwer in index.css
        classNames="modal"
      >
        {/* ...props syntax might look strange but what it does is it takes the props we 
        // pass to Modal that is exported and forwards them to ModalOverlay which is the internal component
        with no export, this allows us for exemple set up a footer, contenClass, header and so on.
          on the exported Modal component where we dont need and dont use those jus mentioned
          props, but we then forward it to ModalOverlay;
          So the three dots is the spread opertor which takes key-value pair of the
          PROPS OBJECT, and spreads them as attributes so to say onto ModalOverlay  */}
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
  // return modal;-original coding but wasnt conistent with Sidedrawer
  return ReactDOM.createPortal(modal, document.getElementById('modal-hook'));
};

export default Modal;
