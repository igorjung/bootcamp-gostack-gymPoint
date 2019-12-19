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
  duration: Yup.number()
    .integer()
    .typeError('A duração é obrigatória')
    .required('A duração é obrigatória'),
  price: Yup.string()
    .typeError('O preço é obrigatório')
    .required('O preço é obrigatório'),
});

export default function PlanEdit({ match }) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState([]);
  const [price, setPrice] = useState('');

  useEffect(() => {
    async function loadPlan() {
      try {
        const { id } = match.params;

        const { data } = await api.get(`plans/${id}`);

        setPlan({
          ...data,
          price: data.price.toString().replace('.', ','),
          fullPrice: 'R$0,00',
        });

        setPrice(data.price);
      } catch (e) {
        if (e.response.data.error === 'undefined') {
          toast.error(`Um erro aconteceu, tente novamente mais tarde.`);
          history.push('/plans');
          return;
        }
        toast.error(e.response.data.error);
        history.push('/plans');
      }
    }

    loadPlan();
  }, [match.params]);

  async function handleSubmit(formData) {
    try {
      const data = {
        ...formData,
        price: formData.price.replace(',', '.'),
      };

      setLoading(true);

      await api.put(`plans/${plan.id}`, { ...data });

      setLoading(false);

      history.push('/plans');

      toast.success('O plano foi atualizado com sucesso.');
    } catch (e) {
      setLoading(false);

      if (e.response.data.error === undefined) {
        toast.error(`Um erro aconteceu, tente novamente mais tarde.`);
        return;
      }

      toast.error(`${e.response.data.error}`);
    }
  }

  function handleChangeDuration(e) {
    if (e.target.value === '') {
      setPlan({ ...plan, duration: '' });
      return;
    }
    if (e.target.value <= 1) {
      setPlan({ ...plan, duration: 1 });
      return;
    }
    if (e.target.value >= 300) {
      setPlan({ ...plan, duration: 300 });
      return;
    }
    setPlan({ ...plan, duration: e.target.value });
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
              setChange={e => setPrice(e)}
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
