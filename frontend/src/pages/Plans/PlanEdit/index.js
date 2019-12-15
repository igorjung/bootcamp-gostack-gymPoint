import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';

import PropTypes from 'prop-types';

import { Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import FormContent from '~/styles/form';
import history from '~/services/history';
import api from '~/services/api';

import { Container, LinkBack, ButtonSave } from '~/styles/header';
import { CurrencyMask } from '~/components/MaskInput';

import format from '~/util/format';

const Schema = Yup.object().shape({
  title: Yup.string().required('O Título é obrigatório'),
  duration: Yup.string().required('A duração é obrigatória'),
});

export default function PlanEdit({ match }) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState([]);
  const [price, setPrice] = useState('');

  useEffect(() => {
    async function loadPlan() {
      const { id } = match.params;

      const response = await api.get(`plans/${id}`);

      setPlan({
        ...response.data,
        fullPrice: 'R$0,00',
      });

      setPrice(response.data.price);
    }

    loadPlan();
  }, [match.params]);

  async function handleSubmit(data) {
    try {
      setLoading(true);

      await api.put(`plans/${plan.id}`, { ...data, price });

      setLoading(false);

      history.push('/plans');

      toast.success('O plano foi atualizado com sucesso.');
    } catch {
      setLoading(false);

      toast.error(
        'Não foi possível realizar a atualização, confira os dados do plano'
      );
    }
  }

  function handleChangeDuration(e) {
    setPlan({ ...plan, duration: e.target.value });
  }

  function handleChangePrice(e) {
    setPrice(e.target.value.replace('R$', '').slice(0, -3));
  }

  const fullPrice = useMemo(() => {
    const p = format(price * plan.duration);
    return p;
  }, [plan.duration, price]);

  return (
    <>
      <Container>
        <h1>Edição de plano</h1>
        <div>
          <Link to="/plans">
            <LinkBack>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <strong>Voltar</strong>
            </LinkBack>
          </Link>

          <ButtonSave form="planEdit" type="submit">
            {loading ? (
              <strong>Carregando...</strong>
            ) : (
              <>
                <MdCheck color="#fff" size={16} />
                <strong>Salvar</strong>
              </>
            )}
          </ButtonSave>
        </div>
      </Container>
      <FormContent
        id="planEdit"
        onSubmit={handleSubmit}
        initialData={plan}
        schema={Schema}
      >
        <strong>TÍTULO DO PLANO</strong>
        <Input name="title" type="text" />

        <div>
          <div>
            <strong>DURAÇÃO(em meses)</strong>
            <Input
              name="duration"
              type="number"
              value={plan.duration || ''}
              onChange={handleChangeDuration}
            />
          </div>
          <div>
            <strong>PREÇO MENSAL</strong>
            <CurrencyMask
              name="price"
              defaultValue={price}
              onChange={handleChangePrice}
            />
          </div>
          <div>
            <strong>PREÇO TOTAL</strong>
            <input value={fullPrice} disabled />
          </div>
        </div>
      </FormContent>
    </>
  );
}

PlanEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
