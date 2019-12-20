import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MdAdd,
  MdSearch,
  MdRefresh,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { Input } from '@rocketseat/unform';

import api from '~/services/api';
import Table from '~/styles/table';
import {
  Pagination,
  PaginationButton,
  PageIndicator,
} from '~/styles/pagination';
import {
  Container,
  InputContent,
  LinkRegister,
  RefreshContent,
} from '~/styles/header';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);

  async function loadStudents() {
    const response = await api.get(`students?page=${page}`);
    setStudents(response.data);

    const nextPage = await api.get(`students?page=${page + 1}`);

    if (!nextPage.data.length) {
      setNext(0);
      return;
    }
    setNext(1);
  }

  useEffect(() => {
    loadStudents();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleDelete(id) {
    try {
      if (
        window.confirm(
          'Você realmente deseja deletar esse aluno? Ao deletar um aluno, a matrícula relacionada a ele sera deletada tambem.'
        )
      ) {
        await api.delete(`students/${id}`);

        loadStudents();

        toast.success('Usuário deletado com sucesso.');
      }
    } catch (e) {
      if (e.response.data.error === undefined) {
        toast.error(`Um erro aconteceu, tente novamente mais tarde.`);
        return;
      }
      toast.error(`${e.response.data.error}`);
    }
  }

  async function handleSubmit({ name }) {
    try {
      const { data } = await api.get(`students?name=${name}`);

      if (!data.length) {
        toast.error('Usuário não encontrado');
        return;
      }
      setStudents(data);
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
        <h1>Gerenciando alunos</h1>
        <div>
          <Link to="students/register">
            <LinkRegister>
              <MdAdd color="#fff" size={20} />
              <strong>Cadastrar</strong>
            </LinkRegister>
          </Link>

          <InputContent onSubmit={handleSubmit}>
            <button type="submit">
              <MdSearch color="#999" size={20} />
            </button>
            <Input name="name" type="text" placeholder="Buscar aluno" />
          </InputContent>

          <RefreshContent type="button" onClick={loadStudents}>
            <MdRefresh color="#999" size={20} />
          </RefreshContent>
        </div>
      </Container>

      <Table>
        <tbody>
          <tr>
            <th>NOME</th>
            <th>E-MAIL</th>
            <th align="center">IDADE</th>
          </tr>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td align="center">{student.age}</td>
              <td align="right">
                <Link to={`students/${student.id}`}>editar</Link>
                <button type="button" onClick={() => handleDelete(student.id)}>
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
