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
import MaskInput from '~/components/MaskInput';

const Schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  age: Yup.string().required('A idade é obrigatória'),
  weight: Yup.string().required('O peso é obrigatório'),
  height: Yup.string().required('A altura é obrigatória'),
});

export default function StudentRegister() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    setLoading(true);

    if (data.height > 9 && data.height < 99) {
      data.height /= 10;
    }
    if (data.height > 99) {
      data.height /= 100;
    }

    try {
      await api.post('students', data);

      setLoading(false);

      toast.success('O aluno foi cadastrado com sucesso.');

      history.push('/students');
    } catch {
      setLoading(false);

      toast.error(
        'Não foi possível realizar o cadastro, confira os dados do aluno'
      );
    }
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
        <Input name="name" type="text" />
        <strong>ENDEREÇO DE E-MAIL</strong>
        <Input name="email" type="email" />
        <div>
          <div>
            <strong>IDADE</strong>
            <Input name="age" type="number" />
          </div>
          <div>
            <strong>PESO(em kg)</strong>
            <MaskInput name="weight" />
          </div>
          <div>
            <strong>ALTURA</strong>
            <MaskInput name="height" />
          </div>
        </div>
      </FormContent>
    </>
  );
}
