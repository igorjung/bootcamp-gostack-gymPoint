import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  MdAdd,
  MdCheckCircle,
  MdRefresh,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';

import api from '~/services/api';

import Table from '~/styles/table';
import {
  Pagination,
  PaginationButton,
  PageIndicator,
} from '~/styles/pagination';
import { Container, LinkRegister, RefreshContent } from '~/styles/header';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);

  async function loadRegistration() {
    const response = await api.get(`registrations?page=${page}`);

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

    const nextPage = await api.get(`registrations?page=${page + 1}`);

    if (!nextPage.data.length) {
      setNext(0);
      return;
    }
    setNext(1);
  }

  useEffect(() => {
    loadRegistration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleDelete(id) {
    if (window.confirm('Você realmente deseja deletar essa matrícula?')) {
      await api.delete(`registrations/${id}`);

      loadRegistration();

      toast.success('Matrícula deletada com sucesso.');
    }
  }

  function handlePreview() {
    setPage(page - 1);
  }

  function handleNext() {
    setPage(page + 1);
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

      <Pagination>
        <PaginationButton
          type="submit"
          disabled={page <= 1}
          onClick={handlePreview}
        >
          <MdKeyboardArrowLeft color="#fff" size={20} />
        </PaginationButton>
        <PageIndicator>
          <strong>{page}</strong>
        </PageIndicator>
        <PaginationButton type="submit" disabled={!next} onClick={handleNext}>
          <MdKeyboardArrowRight color="#fff" size={20} />
        </PaginationButton>
      </Pagination>
    </>
  );
}
