import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import api from '~/services/api';
import Header from '~/components/Header';
import { Container, SubmitButton, SubmitInput, IconContainer } from './styles';

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
    } catch (e) {
      Alert.alert('Erro ao publicar a pergunta', `${e.response.data.error}`);
    }
  }

  return (
    <>
      <Header history>
        <IconContainer onPress={() => navigation.navigate('Help_Orders')}>
          <Icon name="keyboard-arrow-left" color="#999" size={20} />
        </IconContainer>
      </Header>
      <Container>
        <SubmitInput
          autoFocus
          multiline
          placeholder="Inclua sua pergunta"
          onSubmitEditing={handleSubmit}
          value={question}
          onChangeText={setQuestion}
        />
        <SubmitButton onPress={handleSubmit}>Enviar pergunta</SubmitButton>
      </Container>
    </>
  );
}

New.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
