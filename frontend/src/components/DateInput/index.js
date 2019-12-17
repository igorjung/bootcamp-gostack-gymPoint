import React, { useEffect, useState, useRef } from 'react';
import pt from 'date-fns/locale/pt';
import PropTypes from 'prop-types';
import { useField } from '@rocketseat/unform';

import { DatePicker } from './styles';

import 'react-datepicker/dist/react-datepicker.css';

export default function DateInput({ name, setChange, ...inputProps }) {
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [value, setValue] = useState(defaultValue && defaultValue);
  const ref = useRef();

  useEffect(() => setValue(defaultValue), [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.selected',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, fieldName]);

  function handleChange(date) {
    setValue(date);
    setChange(date);
  }
  return (
    <>
      <DatePicker
        name={fieldName}
        selected={value}
        onChange={handleChange}
        locale={pt}
        defaultValue
        ref={ref}
        placeholder="Escolha um data"
        dateFormat="P"
        {...inputProps}
      />
      {error && <span>{error}</span>}
    </>
  );
}

DateInput.propTypes = {
  name: PropTypes.string.isRequired,
  setChange: PropTypes.func.isRequired,
};
