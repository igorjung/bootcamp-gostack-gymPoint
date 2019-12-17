import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { signOut } from '~/store/modules/auth/actions';
import logo from '~/assets/logo02.png';
import { Container, Content, MenuLink, NavContainer } from './styles';

const links = [
  {
    name: 'ALUNOS',
    href: '/students',
  },
  {
    name: 'PLANOS',
    href: '/plans',
  },
  {
    name: 'MATRÍCULAS',
    href: '/enrollments',
  },
  {
    name: 'PEDIDOS DE AUXÍLIO',
    href: '/helporders',
  },
];

const ActiveStyle = {
  color: '#333',
};

export default function Header() {
  const profile = useSelector(state => state.auth.profile);

  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <NavContainer>
          <div>
            <img src={logo} alt="GymPoint" />
            <strong>GYMPOINT</strong>
          </div>
          <>
            {links.map(link => (
              <MenuLink
                activeStyle={ActiveStyle}
                key={link.name}
                to={link.href}
              >
                {link.name}
              </MenuLink>
            ))}
          </>
        </NavContainer>

        <div>
          <strong>{profile.name}</strong>
          <button type="button" onClick={handleSignOut}>
            sair do sistema
          </button>
        </div>
      </Content>
    </Container>
  );
}
