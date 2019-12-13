import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
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
  const [checkins, setCheckins] = useState([]);

  async function loadCheckins() {
    const response = await api.get(`students/${id}/checkins`);

    const data = response.data.map(checkin => ({
      ...checkin,
      date: formatRelative(parseISO(checkin.createdAt), new Date(), {
        locale: pt,
        addSuffix: true,
      }),
    }));

    setCheckins(data);
  }

  useEffect(() => {
    loadCheckins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        {checkins && (
          <List
            data={checkins}
            keyExtractor={item => String(item.id)}
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
