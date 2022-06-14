import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';

const SuccessModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      header="Sukces!"
      show={!!props.success}
      footer={<Button onClick={props.onClear}>Ok</Button>}
    >
      <p>{props.success}</p>
    </Modal>
  );
};

export default SuccessModal;
