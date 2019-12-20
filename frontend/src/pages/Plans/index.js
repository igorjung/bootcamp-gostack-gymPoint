import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MdAdd,
  MdRefresh,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { toast } from 'react-toastify';

import api from '~/services/api';
import Table from '~/styles/table';
import {
  Pagination,
  PaginationButton,
  PageIndicator,
} from '~/styles/pagination';
import { Container, LinkRegister, RefreshContent } from '~/styles/header';
import { signOut } from '~/store/modules/auth/actions';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);

  const dispatch = useDispatch();

  async function loadPlans() {
    try {
      const response = await api.get(`plans?page=${page}`);

      const { format } = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const data = response.data.map(plan => {
        const priceFormatted = format(plan.price);

        const durationFormatted =
          plan.duration > 1 ? `${plan.duration} meses` : `${plan.duration} mês`;

        return {
          ...plan,
          priceFormatted,
          durationFormatted,
        };
      });

      setPlans(data);

      const nextPage = await api.get(`plans?page=${page + 1}`);

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
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleDelete(id) {
    try {
      if (
        window.confirm(
          'Você realmente deseja deletar esse plano? Ao deletar o plano, as matrículas relacionadas a ele serão deletadas juntas.'
        )
      ) {
        await api.delete(`plans/${id}`);

        loadPlans();

        toast.success('Plano deletado com sucesso.');
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
        <h1>Gerenciando planos</h1>
        <div>
          <Link to="plans/register">
            <LinkRegister>
              <MdAdd color="#fff" size={20} />
              <strong>Cadastrar</strong>
            </LinkRegister>
          </Link>

          <RefreshContent type="button" onClick={loadPlans}>
            <MdRefresh color="#999" size={20} />
          </RefreshContent>
        </div>
      </Container>

      <Table>
        <tbody>
          <tr>
            <th>TÍTULO</th>
            <th align="center">DURAÇÃO</th>
            <th align="center">VALOR p/MÊS</th>
          </tr>

          {plans.map(plan => (
            <tr key={plan.id}>
              <td>{plan.title}</td>
              <td align="center">{plan.durationFormatted}</td>
              <td align="center">{plan.priceFormatted}</td>
              <td align="right">
                <Link to={`plans/${plan.id}`}>editar</Link>
                <button type="button" onClick={() => handleDelete(plan.id)}>
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
