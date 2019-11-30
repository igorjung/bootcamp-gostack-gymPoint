import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { signOut } from '~/store/modules/auth/actions';

import logo from '~/assets/logo.png';

import { Container, Content } from './styles';

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
    href: '/registrations',
  },
  {
    name: 'PEDIDOS DE AUXÍLIO',
    href: '/helporders',
  },
];

export default function Header() {
  const profile = useSelector(state => state.auth.profile);

  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="GymPoint" />
          <>
            {links.map(link => (
              <Link
                className={
                  window.location.href.includes(link.href) ? 'current' : ''
                }
                key={link.name}
                to={link.href}
              >
                {link.name}
              </Link>
            ))}
          </>
        </nav>

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
