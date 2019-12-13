import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';

import api from '~/services/api';
import Header from '~/components/Header';
import { Container, SubmitButton, SubmitInput } from './styles';

export default function New({ navigation }) {
  const id = useSelector(state => state.auth.profile.id);

  const [question, setQuestion] = useState('');

  async function handleSubmit() {
    try {
      await api.post(`/students/${id}/help-orders`, {
        question,
      });

      Alert.alert(
        'Nova pergunta publicada',
        'Sua pergunta foi publicada com sucesso.'
      );

      navigation.navigate('Help_Orders');
    } catch {
      Alert.alert('Erro ao publicar a pergunta', 'Tente novamente mais tarde.');
    }
  }

  return (
    <>
      <Header />
      <Container>
        <SubmitInput
          autoFocus
          multiline
          placeholder="Inclua seu pedido de auxílio"
          onSubmitEditing={handleSubmit}
          value={question}
          onChangeText={setQuestion}
        />
        <SubmitButton onPress={handleSubmit}>Enviar pedido</SubmitButton>
      </Container>
    </>
  );
}
