import React, { useEffect, useState, useRef } from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import PropTypes from 'prop-types';
import { useField } from '@rocketseat/unform';

export function HeightMask({ name, ...inputProps }) {
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [value, setValue] = useState(defaultValue && defaultValue);
  const ref = useRef();

  useEffect(() => setValue(defaultValue), [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, fieldName]);

  const defaultMask = {
    prefix: '',
    suffix: 'm',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: 1,
    allowNegative: false,
    allowLeadingZeroes: false,
    inputMode: 'numeric',
    maskOptions: {},
    requireDecimal: true,
  };

  const mask = createNumberMask(defaultMask);

  function handleChange(e) {
    setValue(e.target.value.replace('m', ''));
  }

  return (
    <>
      <MaskedInput
        onChange={handleChange}
        value={value}
        mask={mask}
        name={fieldName}
        ref={ref}
        {...inputProps}
      />
      {error && <span>{error}</span>}
    </>
  );
}

export function WeightMask({ name, ...inputProps }) {
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [value, setValue] = useState(defaultValue && defaultValue);
  const ref = useRef();

  useEffect(() => setValue(defaultValue), [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, fieldName]);

  const defaultMask = {
    prefix: '',
    suffix: 'kg',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: 3,
    allowNegative: false,
    allowLeadingZeroes: false,
    inputMode: 'numeric',
    maskOptions: {},
  };
  const mask = createNumberMask(defaultMask);

  function handleChange(e) {
    setValue(e.target.value.replace('kg', ''));
  }

  return (
    <>
      <MaskedInput
        onChange={handleChange}
        value={value}
        mask={mask}
        name={fieldName}
        ref={ref}
        {...inputProps}
      />
      {error && <span>{error}</span>}
    </>
  );
}

export function CurrencyMask({ name, setChange, ...inputProps }) {
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [value, setValue] = useState(defaultValue && defaultValue);
  const ref = useRef();

  useEffect(() => setValue(defaultValue), [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, fieldName]);

  const defaultMask = {
    prefix: 'R$',
    suffix: '',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 2,
    integerLimit: 3,
    allowNegative: false,
    allowLeadingZeroes: false,
    maskOptions: {},
  };
  const mask = createNumberMask(defaultMask);

  function handleChange(e) {
    setValue(e.target.value.replace('R$', ''));
    setChange(e.target.value.replace('R$', '').replace(',', '.'));
  }

  return (
    <>
      <MaskedInput
        onChange={handleChange}
        value={value}
        mask={mask}
        name={fieldName}
        ref={ref}
        type="text"
        {...inputProps}
      />
      {error && <span>{error}</span>}
    </>
  );
}

HeightMask.propTypes = {
  name: PropTypes.string.isRequired,
};

WeightMask.propTypes = {
  name: PropTypes.string.isRequired,
};

CurrencyMask.propTypes = {
  name: PropTypes.string.isRequired,
  setChange: PropTypes.func.isRequired,
};
