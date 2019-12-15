import React, { useState, useEffect, useMemo } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

import { addMonths, addDays, format, parseISO } from 'date-fns';
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

export default function RegistrationRegister() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [selectPlan, setSelectPlan] = useState('');
  const [selectStudent, setSelectStudent] = useState('');

  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  useEffect(() => {
    async function loadPlans() {
      const { data } = await api.get('plans?page=0');

      setPlans(data);
    }

    loadPlans();
  }, []);

  async function loadStudents(inputValue) {
    if (!inputValue) {
      const { data } = await api.get('students?page=0');

      setStudents(data);

      return data;
    }

    const studentOption = students.filter(student =>
      student.name.includes(inputValue)
    );

    return studentOption;
  }

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

  async function handleRegister() {
    try {
      const { id: student_id } = selectStudent;

      const { id: plan_id } = selectPlan;

      setLoading(true);

      const data = {
        plan_id,
        start_date: format(parseISO(startDate), 'MM/dd/yyyy'),
      };

      await api.post(`students/${student_id}/registrations`, data);

      setLoading(false);

      history.push('/registrations');

      toast.success('A matrícula foi cadastrada com sucesso.');
    } catch {
      setLoading(false);

      toast.error(
        'Não foi possível realizar o cadastro, confira os dados da matrícula'
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

          <ButtonSave type="button" onClick={handleRegister}>
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

      <Content>
        <strong>ALUNO</strong>
        <AsyncSelect
          name="student"
          defaultOptions
          loadOptions={loadStudents}
          getOptionValue={option => option.id}
          getOptionLabel={option => option.name}
          onChange={inputValue => setSelectStudent(inputValue)}
          styles={StudentsSelect}
          components={{
            IndicatorSeparator: () => null,
          }}
          placeholder="Buscar aluno"
        />
        <FlexLine>
          <FlexColumn>
            <strong>PLANO</strong>
            <Select
              name="plan"
              options={plans}
              getOptionValue={option => option.id}
              getOptionLabel={option => option.title}
              onChange={inputValue => setSelectPlan(inputValue)}
              components={{
                IndicatorSeparator: () => null,
              }}
              styles={DefaultSelect}
              placeholder="Escolher plano"
            />
          </FlexColumn>
          <FlexColumn>
            <strong>DATA DE INÍCIO</strong>
            <DatePicker
              name="start_date"
              type="date"
              min={minDate}
              value={startDate}
              onChange={handleDate}
              placeholder="Escolha um data"
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
