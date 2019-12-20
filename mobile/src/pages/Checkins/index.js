import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from 'react-navigation';

import api from '~/services/api';
import Header from '~/components/Header';
import {
  Container,
  SubmitButton,
  EmptyText,
  List,
  Item,
  Number,
  Time,
} from './styles';

function Checkins() {
  const id = useSelector(state => state.auth.profile.id);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);

  async function loadCheckins() {
    try {
      setLoading(true);
      const response = await api.get(`students/${id}/checkins?page=1`);

      const data = response.data.map(checkin => ({
        ...checkin,
        date: formatRelative(parseISO(checkin.createdAt), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      }));

      if (!data.length) {
        setLoading(false);
        setLastPage(true);
        return;
      }

      setCheckins(data);
      setLoading(false);
    } catch {
      setLoading(false);
      setLastPage(true);
    }
  }

  useEffect(() => {
    loadCheckins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMore() {
    try {
      const newPage = page + 1;
      if (!lastPage) {
        const response = await api.get(
          `students/${id}/checkins?page=${newPage}`
        );

        const data = response.data.map(checkin => ({
          ...checkin,
          date: formatRelative(parseISO(checkin.createdAt), new Date(), {
            locale: pt,
            addSuffix: true,
          }),
        }));

        if (!data.length) {
          setLastPage(true);
          return;
        }

        setPage(newPage);
        setCheckins([...checkins, ...data]);
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
      const response = await api.get(`students/${id}/checkins?page=1`);

      const data = response.data.map(checkin => ({
        ...checkin,
        date: formatRelative(parseISO(checkin.createdAt), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      }));

      if (!data.length) {
        setRefreshing(false);
        setLastPage(true);
        return;
      }

      setCheckins(data);
      setRefreshing(false);
    } catch {
      setLoading(false);
      setRefreshing(false);
    }
  }

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

  return (
    <>
      <Header />
      <Container>
        <SubmitButton onPress={handleSubmit}>Novo check-in</SubmitButton>
        {loading ? (
          <ActivityIndicator size={30} color="#e25965" marginTop={50} />
        ) : (
          <>
            {checkins.length ? (
              <List
                data={checkins}
                keyExtractor={item => String(item.id)}
                onEndReachedThreshold={0.2}
                onEndReached={loadMore}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                renderItem={({ item, index }) => (
                  <Item>
                    <Number>{`Check-in #${index + 1}`}</Number>
                    <Time>{item.date}</Time>
                  </Item>
                )}
              />
            ) : (
              <>
                <EmptyText>Faça seu primeiro check-in.</EmptyText>
                <Icon name="fitness-center" color="#333" size={40} />
              </>
            )}
          </>
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
