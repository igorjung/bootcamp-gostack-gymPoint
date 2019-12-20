import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  MdRefresh,
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import * as Yup from 'yup';
import { Input } from '@rocketseat/unform';

import api from '~/services/api';
import {
  Pagination,
  PaginationButton,
  PageIndicator,
} from '~/styles/pagination';
import { Container, RefreshContent } from '~/styles/header';
import { Filter, AnswerContainer, Table } from './styles';
import { signOut } from '~/store/modules/auth/actions';

const Schema = Yup.object().shape({
  answer: Yup.string().required('A resposta é obrigatória'),
});

export default function Help_Orders() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(0);
  const [helpOrders, setHelpOrders] = useState([]);
  const [question, setQuestion] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);
  const [answer, setAnswer] = useState('');

  const dispatch = useDispatch();

  async function loadHelpOrders() {
    try {
      const response = await api.get(`help-orders?page=${page}`);
      setHelpOrders(response.data);

      const nextPage = await api.get(`help-orders?page=${page + 1}`);

      if (!nextPage.data.length) {
        setNext(0);
        return;
      }
      setNext(1);
    } catch (e) {
      if (e.response.data.error === 'Token invalid') {
        dispatch(signOut());
      } else {
        toast.error(e.response.data.error);
      }
    }
  }

  useEffect(() => {
    loadHelpOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, page]);

  async function loadQuestion(id) {
    try {
      const response = await api.get(`help-orders/${id}`);

      setQuestion(response.data);

      setVisible(1);
    } catch (e) {
      if (e.response.data.error === undefined) {
        toast.error(`Um erro aconteceu, tente novamente mais tarde.`);
        return;
      }
      toast.error(e.response.data.error);
    }
  }

  async function handleSubmit(data) {
    try {
      setLoading(true);

      await api.post(`/help-orders/${question.id}/answer`, data);

      setLoading(false);

      setVisible(0);

      toast.success('A resposta foi enviada.');

      setAnswer('');
    } catch (e) {
      setLoading(false);

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

  function handleChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <Filter visible={visible} />

      <Container>
        <h1>Pedidos de auxílio</h1>
        <div>
          <RefreshContent type="button" onClick={loadHelpOrders}>
            <MdRefresh color="#999" size={20} />
          </RefreshContent>
        </div>
      </Container>

      <AnswerContainer
        visible={visible}
        onSubmit={handleSubmit}
        schema={Schema}
      >
        <div>
          <button
            type="button"
            onClick={() => setVisible(0) && setQuestion('')}
          >
            <MdClose color="#333" size={16} />
          </button>
        </div>
        <strong>PERGUNTA DO ALUNO</strong>
        <p>{question.question || ''}</p>
        <strong>SUA RESPOSTA</strong>
        <Input
          multiline
          maxLength={255}
          name="answer"
          value={answer}
          onChange={handleChange}
          placeholder="examplo@email.com"
        />
        <button type="submit">
          {loading ? 'Carregando...' : 'Responder aluno'}
        </button>
      </AnswerContainer>

      <Table>
        <tbody>
          <tr>
            <th colSpan="2">ALUNO</th>
          </tr>

          {helpOrders.map(helpOrder => (
            <tr key={helpOrder.id}>
              <td>{helpOrder.student.name}</td>
              <td align="right">
                <button
                  type="button"
                  onClick={() => loadQuestion(helpOrder.id)}
                >
                  responder
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
