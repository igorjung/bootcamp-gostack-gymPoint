import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export function HeightMask({ ...inputProps }) {
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

  return <MaskedInput mask={mask} {...inputProps} />;
}

export function WeightMask({ ...inputProps }) {
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

  return <MaskedInput mask={mask} {...inputProps} />;
}

export function CurrencyMask({ ...inputProps }) {
  const defaultMask = {
    prefix: 'R$',
    suffix: ',00',
    integerLimit: 3,
    allowNegative: false,
    allowLeadingZeroes: false,
    inputMode: 'numeric',
    maskOptions: {},
  };
  const mask = createNumberMask(defaultMask);

  return <MaskedInput mask={mask} {...inputProps} />;
}
