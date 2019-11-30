import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdAdd, MdRefresh } from 'react-icons/md';
import { toast } from 'react-toastify';

import api from '~/services/api';

import Table from '~/styles/table';
import { Container, LinkRegister, RefreshContent } from '~/styles/header';

export default function Plans() {
  const [plans, setPlans] = useState([]);

  async function loadPlans() {
    const response = await api.get('plans');

    const { format } = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const data = response.data.map(plan => {
      const priceFormated = format(plan.price);

      const durationFormated =
        plan.duration > 1 ? `${plan.duration} meses` : `${plan.duration} mês`;

      return {
        ...plan,
        priceFormated,
        durationFormated,
      };
    });

    setPlans(data);
  }

  useEffect(() => {
    loadPlans();
  }, []);

  async function handleDelete(id) {
    if (window.confirm('Você realmente deseja deletar esse plano?')) {
      await api.delete(`plans/${id}`);

      loadPlans();

      toast.success('Plano deletado com sucesso.');
    }
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
              <td align="center">{plan.durationFormated}</td>
              <td align="center">{plan.priceFormated}</td>
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
    </>
  );
}
