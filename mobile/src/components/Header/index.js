import React from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import PropTypes from 'prop-types';
import { signOut } from '~/store/modules/auth/actions';

import logo from '~/assets/logo02.png';
import {
  Container,
  EmptyStyle,
  LogoContainer,
  Image,
  Text,
  LogoutButton,
} from './styles';

export default function Header({ children }) {
  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      {children}
      <LogoContainer>
        <Image source={logo} />
        <Text>GYMPOINT</Text>
      </LogoContainer>
      <LogoutButton onPress={handleSignOut}>
        <Icon name="logout-variant" size={20} color="#fb6f93" />
      </LogoutButton>
    </Container>
  );
}

Header.propTypes = {
  children: PropTypes.element,
};

Header.defaultProps = {
  children: <EmptyStyle />,
};
