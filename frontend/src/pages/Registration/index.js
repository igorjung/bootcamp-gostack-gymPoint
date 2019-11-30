import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { MdAdd, MdCheckCircle, MdRefresh } from 'react-icons/md';

import api from '~/services/api';

import Table from '~/styles/table';
import { Container, LinkRegister, RefreshContent } from '~/styles/header';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);

  async function loadRegistration() {
    const response = await api.get('registrations');

    const data = response.data.map(registration => {
      const formatedStart = format(
        parseISO(registration.start_date),
        "d 'de' MMMM 'de' yyyy",
        {
          locale: pt,
        }
      );

      const formatedEnd = format(
        parseISO(registration.end_date),
        "d 'de' MMMM 'de' yyyy",
        {
          locale: pt,
        }
      );

      return {
        ...registration,
        formatedEnd,
        formatedStart,
      };
    });

    setRegistrations(data);
  }

  useEffect(() => {
    loadRegistration();
  }, []);

  async function handleDelete(id) {
    if (window.confirm('Você realmente deseja deletar essa matrícula?')) {
      await api.delete(`registrations/${id}`);

      loadRegistration();

      toast.success('Matrícula deletada com sucesso.');
    }
  }

  return (
    <>
      <Container>
        <h1>Gerenciando matrículas</h1>
        <div>
          <Link to="registrations/register">
            <LinkRegister>
              <MdAdd color="#fff" size={20} />
              <strong>Cadastrar</strong>
            </LinkRegister>
          </Link>

          <RefreshContent type="button" onClick={loadRegistration}>
            <MdRefresh color="#999" size={20} />
          </RefreshContent>
        </div>
      </Container>

      <Table>
        <tbody>
          <tr>
            <th>ALUNO</th>
            <th align="center">PLANO</th>
            <th align="center">INÍCIO</th>
            <th align="center">TÉRMINO</th>
            <th align="center">ATIVA</th>
          </tr>

          {registrations.map(registration => (
            <tr key={registration.id}>
              <td>{registration.student.name}</td>
              <td align="center">{registration.plan.title}</td>
              <td align="center">{registration.formatedStart}</td>
              <td align="center">{registration.formatedEnd}</td>
              <td align="center">
                <MdCheckCircle
                  size={20}
                  color={registration.active ? '#32CD32' : '#ddd'}
                />
              </td>
              <td align="right">
                <Link to={`/registrations/${registration.id}`}>editar</Link>
                <button
                  type="button"
                  onClick={() => handleDelete(registration.id)}
                >
                  apagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
