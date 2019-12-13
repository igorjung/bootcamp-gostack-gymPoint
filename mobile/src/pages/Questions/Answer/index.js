import React from 'react';

import Header from '~/components/Header';
import {
  Container,
  AnswerContainer,
  AnswerHeader,
  AnswerStrong,
  AnswerText,
  Time,
} from './styles';

export default function Answer({ navigation }) {
  const item = navigation.getParam('item');

  return (
    <>
      <Header />
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
