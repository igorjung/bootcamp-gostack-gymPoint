import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';

import PropTypes from 'prop-types';

import { addDays, addMonths, format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';

import {
  Content,
  InputContent,
  DatePicker,
  FlexLine,
  FlexColumn,
} from '../styles';

import history from '~/services/history';
import api from '~/services/api';

import { Container, LinkBack, ButtonSave } from '~/styles/header';
import { StudentsSelect, DefaultSelect } from '~/styles/asyncSelect';

import formatCurrency from '~/util/format';

export default function RegistrationEdit({ match }) {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [student, setStudent] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [selectPlan, setSelectPlan] = useState('');

  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const { id } = match.params;

  useEffect(() => {
    async function loadData() {
      const { data } = await api.get(`registrations/${id}`);

      setStudent(data.student);
      setSelectPlan(data.plan);
    }

    async function loadPlans() {
      const { data } = await api.get('plans');

      setPlans(data);
    }

    loadData();

    loadPlans();
  }, [id]);

  function handleDate(e) {
    setStartDate(e.target.value);
  }

  const endDate = useMemo(() => {
    const { duration } = selectPlan;
    if (duration && startDate) {
      return format(addMonths(parseISO(startDate), duration), 'dd/MM/yy');
    }
    return format(addDays(new Date(), 1), 'dd/MM/yy');
  }, [startDate, selectPlan]);

  const fullPrice = useMemo(() => {
    const { price, duration } = selectPlan;
    if (price && duration) {
      return formatCurrency(price * duration);
    }
    return 'R$0,00';
  }, [selectPlan]);

  async function handleSave() {
    try {
      const { id: plan_id } = selectPlan;

      setLoading(true);

      const data = {
        plan_id,
        start_date: format(parseISO(startDate), 'MM/dd/yyyy'),
      };

      await api.put(`students/${student.id}/registrations`, data);

      setLoading(false);

      history.push('/registrations');

      toast.success('A matrícula foi editada com sucesso.');
    } catch {
      setLoading(false);

      toast.error(
        'Não foi possível realizar a edição, confira os dados da matrícula'
      );
    }
  }

  return (
    <>
      <Container>
        <h1>Cadastro de matrícula</h1>
        <div>
          <Link to="/registrations">
            <LinkBack>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <strong>Voltar</strong>
            </LinkBack>
          </Link>

          <ButtonSave type="button" onClick={handleSave}>
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

      <Content>
        <strong>ALUNO</strong>
        <InputContent
          disabled
          value={student.name || ''}
          styles={StudentsSelect}
        />
        <FlexLine>
          <FlexColumn>
            <strong>PLANO</strong>
            <Select
              options={plans}
              getOptionValue={option => option.id}
              getOptionLabel={option => option.title}
              onChange={inputValue => setSelectPlan(inputValue)}
              components={{
                IndicatorSeparator: () => null,
              }}
              styles={DefaultSelect}
            />
          </FlexColumn>
          <FlexColumn>
            <strong>DATA DE INÍCIO</strong>
            <DatePicker
              type="date"
              min={minDate}
              value={startDate}
              onChange={handleDate}
            />
          </FlexColumn>
          <FlexColumn>
            <strong>DATA DE TÉRMINO</strong>
            <InputContent
              name="end_date"
              type="text"
              disabled
              value={endDate || ''}
            />
          </FlexColumn>
          <FlexColumn>
            <strong>VALOR FINAL</strong>
            <InputContent
              name="fullPrice"
              type="text"
              disabled
              value={fullPrice || ''}
            />
          </FlexColumn>
        </FlexLine>
      </Content>
    </>
  );
}

RegistrationEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
