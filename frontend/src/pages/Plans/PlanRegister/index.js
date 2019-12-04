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

import format from '~/util/format';

const Schema = Yup.object().shape({
  title: Yup.string().required('O Título é obrigatório'),
  price: Yup.string().required('O preço é obrigatório'),
  duration: Yup.string().required('A duração é obrigatória'),
});

export default function PlanRegister() {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  async function handleSubmit(data) {
    try {
      setLoading(true);

      await api.post('plans', data);

      setLoading(false);

      history.push('/plans');

      toast.success('O plano foi criado com sucesso.');
    } catch {
      setLoading(false);

      toast.error(
        'Não foi possível realizar o cadastro, confira os dados do plano'
      );
    }
  }

  function handleChangeDuration(e) {
    setDuration(e.target.value);
  }

  function handleChangePrice(e) {
    setPrice(e.target.value);
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
        <Input name="title" type="text" />

        <div>
          <div>
            <strong>DURAÇÃO(em meses)</strong>
            <Input
              name="duration"
              type="number"
              value={duration}
              onChange={handleChangeDuration}
            />
          </div>
          <div>
            <strong>PREÇO MENSAL</strong>
            <Input
              name="price"
              type="number"
              step="any"
              value={price}
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
