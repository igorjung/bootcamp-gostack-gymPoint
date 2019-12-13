import React, { useState, useEffect } from 'react';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import api from '~/services/api';
import Header from '~/components/Header';
import {
  Container,
  SubmitButton,
  List,
  Item,
  ItemHeader,
  AnswerContent,
  AnswerText,
  Time,
  Info,
} from './styles';

export default function HelpOrders({ navigation }) {
  const id = useSelector(state => state.auth.profile.id);
  const [questions, setQuestions] = useState([]);

  async function loadQuestions() {
    const response = await api.get('/help-orders', {
      params: {
        student: id,
      },
    });

    const data = response.data.map(question => ({
      ...question,
      date: formatRelative(parseISO(question.createdAt), new Date(), {
        locale: pt,
        addSuffix: true,
      }),
    }));

    setQuestions(data);
  }

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Header />
      <Container>
        <SubmitButton onPress={() => navigation.navigate('New')}>
          Novo pedido de auxílio
        </SubmitButton>
        {questions && (
          <List
            data={questions}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Item
                disabled={!item.answer}
                onPress={() => navigation.navigate('Answer', { item })}
              >
                <ItemHeader>
                  <AnswerContent>
                    <Icon
                      name="check-circle"
                      color={item.answer ? '#32CD32' : '#999'}
                      size={20}
                    />
                    <AnswerText answer={item.answer}>
                      {item.answer ? 'Respondido' : 'Sem resposta'}
                    </AnswerText>
                  </AnswerContent>
                  <Time>{item.date}</Time>
                </ItemHeader>
                <Info>{item.question}</Info>
              </Item>
            )}
          />
        )}
      </Container>
    </>
  );
}

HelpOrders.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
