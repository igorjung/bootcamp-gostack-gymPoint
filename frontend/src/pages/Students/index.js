import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdAdd, MdSearch, MdRefresh } from 'react-icons/md';
import { toast } from 'react-toastify';

import { Input } from '@rocketseat/unform';
import api from '~/services/api';

import Table from '~/styles/table';
import {
  Container,
  InputContent,
  LinkRegister,
  RefreshContent,
} from '~/styles/header';

export default function Students() {
  const [students, setStudents] = useState([]);

  async function loadStudents() {
    const response = await api.get('students');

    setStudents(response.data);
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleDelete(id) {
    if (window.confirm('Você realmente deseja deletar esse usuário?')) {
      await api.delete(`students/${id}`);

      loadStudents();

      toast.success('Usuário deletado com sucesso.');
    }
  }

  async function handleSubmit({ name }) {
    const { data } = await api.get(`students?name=${name}`);

    setStudents(data);
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
          {students.length > 1 ? (
            students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td align="center">{student.age}</td>
                <td align="right">
                  <Link to={`students/${student.id}`}>editar</Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(student.id)}
                  >
                    apagar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr key={students.id}>
              <td>{students.name}</td>
              <td>{students.email}</td>
              <td align="center">{students.age}</td>
              <td align="right">
                <Link to={`students/${students.id}`}>editar</Link>
                <button type="button" onClick={() => handleDelete(students.id)}>
                  apagar
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}
