import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { Input } from '@rocketseat/unform';
import { Container } from './styles';

export default function MaskInput({ name }) {
  const [mask, setMask] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    switch (name) {
      case 'weight': {
        setMask('kg');
        break;
      }
      case 'height': {
        setMask('m');
        break;
      }
      default:
    }
  }, [name]);

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  return (
    <Container>
      <Input onChange={handleChange} name={name} type="number" step="any" />
      <p>{inputValue ? mask : ''}</p>
    </Container>
  );
}

MaskInput.propTypes = {
  name: PropTypes.string.isRequired,
};
