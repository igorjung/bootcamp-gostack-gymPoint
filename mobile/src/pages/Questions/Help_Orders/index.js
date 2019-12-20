import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
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
  EmptyText,
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
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState([]);

  async function loadQuestions() {
    try {
      setLoading(true);
      const response = await api.get('/help-orders?page=1', {
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

      if (!data.length) {
        setLoading(false);
        setLastPage(true);
        return;
      }

      setQuestions(data);
      setLoading(false);
    } catch {
      setLastPage(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMore() {
    try {
      const newPage = page + 1;
      console.tron.log(newPage);
      if (!lastPage) {
        const response = await api.get(`/help-orders?page=${newPage}`, {
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

        if (!data.length) {
          setLastPage(true);
          return;
        }

        setPage(newPage);
        setQuestions([...questions, ...data]);
      }
    } catch {
      setLastPage(true);
    }
  }

  async function handleRefresh() {
    try {
      setPage(1);
      setLastPage(false);
      setRefreshing(true);
      const response = await api.get('/help-orders?page=1', {
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

      if (!data.length) {
        setRefreshing(false);
        setLastPage(true);
        return;
      }

      setQuestions(data);
      setRefreshing(false);
    } catch {
      setLastPage(true);
      setRefreshing(false);
    }
  }

  return (
    <>
      <Header />
      <Container>
        <SubmitButton onPress={() => navigation.navigate('New')}>
          Novo pedido de auxílio
        </SubmitButton>
        {loading || refreshing ? (
          <ActivityIndicator size={30} color="#e25965" marginTop={50} />
        ) : (
          <>
            {questions.length ? (
              <List
                data={questions}
                keyExtractor={item => String(item.id)}
                onEndReached={loadMore}
                onEndReachedThreshold={0.2}
                onRefresh={handleRefresh}
                refreshing={refreshing}
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
                    <Info numberOfLines={1}>{item.question}</Info>
                  </Item>
                )}
              />
            ) : (
              <>
                <EmptyText>Faça sua primeira pergunta.</EmptyText>
                <Icon name="question-answer" color="#333" size={40} />
              </>
            )}
          </>
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
