import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  MdAdd,
  MdCheckCircle,
  MdRefresh,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';
import Table from '~/styles/table';
import {
  Pagination,
  PaginationButton,
  PageIndicator,
} from '~/styles/pagination';
import { Container, LinkRegister, RefreshContent } from '~/styles/header';
import { signOut } from '~/store/modules/auth/actions';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);

  const dispatch = useDispatch();

  async function loadEnrollment() {
    try {
      const response = await api.get(`enrollments?page=${page}`);

      const data = response.data.map(enrollment => {
        const formatedStart = format(
          parseISO(enrollment.start_date),
          "d 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        );

        const formatedEnd = format(
          parseISO(enrollment.end_date),
          "d 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        );

        return {
          ...enrollment,
          formatedEnd,
          formatedStart,
        };
      });

      setEnrollments(data);

      const nextPage = await api.get(`enrollments?page=${page + 1}`);

      if (!nextPage.data.length) {
        setNext(0);
        return;
      }
      setNext(1);
    } catch (e) {
      if (e.response.data.error === 'Token invalid') {
        dispatch(signOut());
      } else {
        toast.error(e.response.data.error);
      }
    }
  }

  useEffect(() => {
    loadEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleDelete(id) {
    try {
      if (window.confirm('Você realmente deseja deletar essa matrícula?')) {
        await api.delete(`enrollments/${id}`);

        loadEnrollment();

        toast.success('Matrícula deletada com sucesso.');
      }
    } catch (e) {
      if (e.response.data.error === undefined) {
        toast.error(`Um erro aconteceu, tente novamente mais tarde.`);
        return;
      }
      toast.error(`${e.response.data.error}`);
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
          <Link to="enrollments/register">
            <LinkRegister>
              <MdAdd color="#fff" size={20} />
              <strong>Cadastrar</strong>
            </LinkRegister>
          </Link>

          <RefreshContent type="button" onClick={loadEnrollment}>
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

          {enrollments.map(enrollment => (
            <tr key={enrollment.id}>
              <td>{enrollment.student.name}</td>
              <td align="center">{enrollment.plan.title}</td>
              <td align="center">{enrollment.formatedStart}</td>
              <td align="center">{enrollment.formatedEnd}</td>
              <td align="center">
                <MdCheckCircle
                  size={20}
                  color={enrollment.active ? '#32CD32' : '#ddd'}
                />
              </td>
              <td align="right">
                <Link to={`/enrollments/${enrollment.id}`}>editar</Link>
                <button
                  type="button"
                  onClick={() => handleDelete(enrollment.id)}
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
