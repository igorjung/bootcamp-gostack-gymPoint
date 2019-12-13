import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from './pages/SignIn';

import Checkins from './pages/Checkins';

import Help_Orders from './pages/Questions/Help_Orders';
import Answer from './pages/Questions/Answer';
import New from './pages/Questions/New';

export default (signedIn = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        SignIn,
        App: createBottomTabNavigator(
          {
            Checkins,
            Questions: {
              screen: createSwitchNavigator({
                Help_Orders,
                Answer,
                New,
              }),
              navigationOptions: {
                tabBarLabel: 'Pedir ajuda',
                resetOnBlur: true,
                tabBarOptions: {
                  keyboardHidesTabBar: true,
                  activeTintColor: '#e25965',
                  inactiveTintColor: '#999',
                  style: {
                    backgroundColor: '#fff',
                    borderTopColor: '#ddd',
                  },
                },
                // eslint-disable-next-line react/prop-types
                tabBarIcon: ({ tintColor }) => (
                  <Icon name="live-help" size={20} color={tintColor} />
                ),
              },
            },
          },
          {
            resetOnBlur: true,
            tabBarOptions: {
              keyboardHidesTabBar: true,
              activeTintColor: '#e25965',
              inactiveTintColor: '#999',
              style: {
                backgroundColor: '#fff',
                borderTopColor: '#ddd',
              },
            },
          }
        ),
      },
      {
        initialRouteName: signedIn ? 'App' : 'SignIn',
      }
    )
  );
