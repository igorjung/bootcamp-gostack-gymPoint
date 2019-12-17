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

    try {
      await api.put(`students/${student.id}`, { ...data });

      setLoading(false);

      toast.success('Os dados do aluno foram atualizados com sucesso.');

      history.push('/students');
    } catch (e) {
      setLoading(false);

      toast.error(`${e.response.data.error}`);
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

StudentEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
