import React from 'react';

import logo from '~/assets/logo02.png';
import { Container, Image, Text } from './styles';

export default function Header() {
  return (
    <Container>
      <Image source={logo} />
      <Text>GYMPOINT</Text>
    </Container>
  );
}
