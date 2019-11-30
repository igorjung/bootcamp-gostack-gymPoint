import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { MdRefresh } from 'react-icons/md';

import * as Yup from 'yup';
import { Input } from '@rocketseat/unform';
import api from '~/services/api';

import { Container, RefreshContent } from '~/styles/header';
import { Filter, AnswerContainer, Table } from './styles';

const Schema = Yup.object().shape({
  answer: Yup.string().required('A resposta é obrigatória'),
});

export default function Help_Orders() {
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);

  const [helpOrders, setHelpOrders] = useState([]);

  const [question, setQuestion] = useState([]);

  async function loadHelpOrders() {
    const response = await api.get('help-orders');
    setHelpOrders(response.data);
  }

  useEffect(() => {
    loadHelpOrders();
  }, [loading, visible]);

  async function loadQuestion(id) {
    const response = await api.get(`help-orders/${id}`);

    setQuestion(response.data);

    setVisible(true);
  }

  async function handleSubmit(data) {
    try {
      setLoading(true);

      await api.post(`/help-orders/${question.id}/answer`, data);

      setLoading(false);

      setVisible(false);

      toast.success('A resposta foi enviada.');
    } catch {
      setLoading(false);

      toast.error(
        'Não foi possível enviar a resposta, tente novamente mais tarde.'
      );
    }
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
        <strong>PERGUNTA DO ALUNO</strong>
        <p>{question.question || ''}</p>
        <strong>SUA RESPOSTA</strong>
        <Input multiline name="answer" placeholder="examplo@email.com" />
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
    </>
  );
}