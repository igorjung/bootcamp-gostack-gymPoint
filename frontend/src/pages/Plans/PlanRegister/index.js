import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';
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
  price: Yup.string().required('O preço é obrigatório'),
});

export default function PlanRegister() {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  async function handleSubmit(formData) {
    try {
      const data = {
        ...formData,
        price: formData.price.replace(',', '.'),
      };

      setLoading(true);

      await api.post('plans', { ...data });

      setLoading(false);

      history.push('/plans');

      toast.success('O plano foi criado com sucesso.');
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
      setDuration('');
      return;
    }
    if (e.target.value <= 1) {
      setDuration(1);
      return;
    }
    if (e.target.value >= 300) {
      setDuration(300);
      return;
    }
    setDuration(e.target.value);
  }

  const fullPrice = useMemo(() => {
    const p = format(price * duration);
    return p;
  }, [price, duration]);

  return (
    <>
      <Container>
        <h1>Cadastro de plano</h1>
        <div>
          <Link to="/plans">
            <LinkBack>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <strong>Voltar</strong>
            </LinkBack>
          </Link>

          <ButtonSave type="submit" form="planRegister">
            {loading ? (
              <strong>Carregando...</strong>
            ) : (
              <>
                <MdCheck color="#fff" size={16} />
                <strong>Cadastrar</strong>
              </>
            )}
          </ButtonSave>
        </div>
      </Container>

      <FormContent id="planRegister" onSubmit={handleSubmit} schema={Schema}>
        <strong>TÍTULO DO PLANO</strong>
        <Input name="title" type="text" placeholder="Anual" />

        <div>
          <div>
            <strong>DURAÇÃO(em meses)</strong>
            <Input
              name="duration"
              type="number"
              min={1}
              value={duration}
              onChange={handleChangeDuration}
            />
          </div>
          <div>
            <strong>PREÇO MENSAL</strong>
            <CurrencyMask name="price" setChange={e => setPrice(e)} />
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
