import React, { useEffect, useState, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { useField } from '@rocketseat/unform';

import { StudentsSelect, DefaultSelect } from './styles';

export function NameSelect({ name, ...inputProps }) {
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [value, setValue] = useState(defaultValue && defaultValue);
  const ref = useRef();

  useEffect(() => setValue(defaultValue), [defaultValue]);

  function parseSelectValue(selectRef) {
    return selectRef.select.state.value;
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'state.value',
      parseValue: parseSelectValue,
      clearValue: selectRef => {
        selectRef.select.clearValue();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, fieldName]);

  function handleChange(data) {
    setValue(data);
  }

  return (
    <>
      <AsyncSelect
        name={fieldName}
        value={value}
        defaultOptions
        getOptionValue={option => option.id}
        getOptionLabel={option => option.name}
        onChange={handleChange}
        ref={ref}
        styles={StudentsSelect}
        components={{
          IndicatorSeparator: () => null,
        }}
        placeholder="Buscar aluno"
        {...inputProps}
      />
      {error && <span>{error}</span>}
    </>
  );
}

export function PlanSelect({ name, setChange, ...inputProps }) {
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [value, setValue] = useState(defaultValue && defaultValue);
  const ref = useRef();

  useEffect(() => setValue(defaultValue), [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'state.value',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, fieldName]);

  function handleChange(data) {
    setValue(data);
    setChange(data);
  }

  return (
    <>
      <Select
        name={fieldName}
        value={value}
        onChange={handleChange}
        ref={ref}
        getOptionValue={option => option.id}
        getOptionLabel={option => option.title}
        styles={DefaultSelect}
        components={{
          IndicatorSeparator: () => null,
        }}
        placeholder="Escolher plano"
        {...inputProps}
      />
      {error && <span>{error}</span>}
    </>
  );
}

NameSelect.propTypes = {
  name: PropTypes.string.isRequired,
};

PlanSelect.propTypes = {
  name: PropTypes.string.isRequired,
  setChange: PropTypes.func.isRequired,
};
