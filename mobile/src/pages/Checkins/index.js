import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from 'react-navigation';

import api from '~/services/api';
import Header from '~/components/Header';
import { Container, SubmitButton, List, Item, Number, Time } from './styles';

function Checkins() {
  const id = useSelector(state => state.auth.profile.id);
  const [loading, setLoading] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  async function loadCheckins() {
    try {
      setLoading(true);
      const response = await api.get(`students/${id}/checkins?page=${page}`);

      const data = response.data.map(checkin => ({
        ...checkin,
        date: formatRelative(parseISO(checkin.createdAt), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      }));

      console.tron.log(data);

      setCheckins({ ...checkins, data });

      setLoading(false);
    } catch {
      setLoading(false);
      setLastPage(0);
    }
  }

  useEffect(() => {
    loadCheckins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  async function handleSubmit() {
    try {
      await api.post(`students/${id}/checkins`);

      loadCheckins();

      Alert.alert(
        'Novo check-in',
        'Seu novo check-in foi realizado com sucesso.'
      );
    } catch {
      Alert.alert(
        'Limite de check-ins alcançado',
        'Você realizou mais de 5 check-ins essa semana.'
      );
    }
  }

  function handlePagination() {
    if (!lastPage) {
      setPage(page + 1);
    }
  }

  return (
    <>
      <Header />
      <Container>
        <SubmitButton onPress={handleSubmit}>Novo check-in</SubmitButton>
        {loading ? (
          <ActivityIndicator size={30} color="#e25965" marginTop={50} />
        ) : (
          <List
            data={checkins}
            keyExtractor={item => String(item.id)}
            onEndReached={handlePagination}
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => (
              <Item>
                <Number>{`Check-in #${item.id}`}</Number>
                <Time>{item.date}</Time>
              </Item>
            )}
          />
        )}
      </Container>
    </>
  );
}

Checkins.navigationOptions = {
  tabBarLabel: 'Check-ins',
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ tintColor }) => (
    <Icon name="edit-location" size={20} color={tintColor} />
  ),
};

export default withNavigation(Checkins);
