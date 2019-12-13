import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import logo from '~/assets/logo.png';
import { Container, SubmitButton, SubmitInput, Image } from './styles';
import { signInRequest } from '~/store/modules/auth/actions';

export default function SignIn() {
  const dispatch = useDispatch();

  const [id, setId] = useState('');

  function handleSubmit() {
    dispatch(signInRequest(id));
  }

  return (
    <Container>
      <Image source={logo} />
      <SubmitInput
        placeholder="Informe seu ID de cadastro"
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
        value={id}
        onChangeText={setId}
      />
      <SubmitButton onPress={handleSubmit}>Entrar no sistema</SubmitButton>
    </Container>
  );
}
