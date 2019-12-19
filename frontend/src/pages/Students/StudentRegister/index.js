import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';
import { Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import FormContent from '~/styles/form';
import history from '~/services/history';
import api from '~/services/api';
import { Container, LinkBack, ButtonSave } from '~/styles/header';
import { HeightMask, WeightMask } from '~/components/MaskInput';

const Schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  age: Yup.number()
    .integer()
    .typeError('A idade é obrigatória')
    .required('A idade é obrigatória'),
  weight: Yup.number()
    .typeError('O peso é obrigatório')
    .required('O peso é obrigatório'),
  height: Yup.number()
    .typeError('A altura é obrigatŕoia')
    .required('A altura é obrigatŕoia'),
});

export default function StudentRegister() {
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState('');

  async function handleSubmit(data) {
    setLoading(true);

    try {
      await api.post('students', { ...data });

      setLoading(false);

      toast.success('O aluno foi cadastrado com sucesso.');

      history.push('/students');
    } catch (e) {
      setLoading(false);
      if (e.response.data.error === undefined) {
        toast.error(`Um erro aconteceu, tente novamente mais tarde.`);
        return;
      }

      toast.error(`${e.response.data.error}`);
    }
  }

  function handleChangeAge(e) {
    if (e.target.value === '') {
      setAge('');
      return;
    }
    if (e.target.value <= 1) {
      setAge(1);
      return;
    }
    if (e.target.value >= 120) {
      setAge(120);
      return;
    }
    setAge(e.target.value);
  }

  return (
    <>
      <Container>
        <h1>Cadastro de aluno</h1>
        <div>
          <Link to="/students">
            <LinkBack>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <strong>Voltar</strong>
            </LinkBack>
          </Link>

          <ButtonSave form="studentRegister" type="submit">
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

      <FormContent id="studentRegister" schema={Schema} onSubmit={handleSubmit}>
        <strong>NOME COMPLETO</strong>
        <Input name="name" type="text" placeholder="Aluno" />
        <strong>ENDEREÇO DE E-MAIL</strong>
        <Input name="email" type="email" placeholder="aluno@email.com" />
        <div>
          <div>
            <strong>IDADE</strong>
            <Input
              name="age"
              type="number"
              value={age}
              onChange={handleChangeAge}
            />
          </div>
          <div>
            <strong>PESO(em kg)</strong>
            <WeightMask name="weight" />
          </div>
          <div>
            <strong>ALTURA</strong>
            <HeightMask name="height" />
          </div>
        </div>
      </FormContent>
    </>
  );
}
