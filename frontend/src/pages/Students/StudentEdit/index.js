import React, { useState, useEffect } from 'react';
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

const Schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  age: Yup.string().required('A idade é obrigatória'),
  weight: Yup.string().required('O peso é obrigatório'),
  height: Yup.string().required('A altura é obrigatória'),
});

export default function StudentEdit({ match }) {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);

  useEffect(() => {
    async function loadStudent() {
      const { id } = match.params;

      const response = await api.get(`students/${id}`);

      setStudent(response.data);
    }

    loadStudent();
  }, [match.params]);

  async function handleSubmit(data) {
    setLoading(true);

    if (data.height > 9 && data.height < 99) {
      data.height /= 10;
    }
    if (data.height > 99) {
      data.height /= 100;
    }

    try {
      await api.put(`students/${student.id}`, data);

      setLoading(false);

      toast.success('Os dados do aluno foram atualizados com sucesso.');

      history.push('/students');
    } catch {
      setLoading(false);

      toast.error('Não foi possível atualizar, confira os dados do aluno');
    }
  }

  return (
    <>
      <Container>
        <h1>Edição de aluno</h1>
        <div>
          <Link to="/students">
            <LinkBack>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <strong>Voltar</strong>
            </LinkBack>
          </Link>

          <ButtonSave type="submit" form="studentEdit">
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
        id="studentEdit"
        schema={Schema}
        onSubmit={handleSubmit}
        initialData={student}
      >
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
            <Input name="weight" type="number" step="any" />
          </div>
          <div>
            <strong>ALTURA</strong>
            <Input name="height" type="number" step="any" />
          </div>
        </div>
      </FormContent>
    </>
  );
}

StudentEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
