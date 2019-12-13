import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import Header from '~/components/Header';
import {
  Container,
  AnswerContainer,
  AnswerHeader,
  AnswerStrong,
  AnswerText,
  Time,
  IconContainer,
} from './styles';

export default function Answer({ navigation }) {
  const item = navigation.getParam('item');

  return (
    <>
      <Header history>
        <IconContainer onPress={() => navigation.navigate('Help_Orders')}>
          <Icon name="keyboard-arrow-left" color="#999" size={20} />
        </IconContainer>
      </Header>
      <Container>
        <AnswerContainer>
          <AnswerHeader>
            <AnswerStrong>PERGUNTA</AnswerStrong>
            <Time>{item.date}</Time>
          </AnswerHeader>
          <AnswerText>{item.question}</AnswerText>
          <AnswerStrong>RESPOSTA</AnswerStrong>
          <AnswerText>{item.answer || ''}</AnswerText>
        </AnswerContainer>
      </Container>
    </>
  );
}

Answer.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
