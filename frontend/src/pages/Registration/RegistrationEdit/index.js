import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { addDays, addMonths, format } from 'date-fns';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';

import { FormContent, InputContent, FlexLine, FlexColumn } from '../styles';

import history from '~/services/history';
import api from '~/services/api';

import { Container, LinkBack, ButtonSave } from '~/styles/header';
import { StudentsSelect, DefaultSelect } from '~/styles/asyncSelect';

import formatCurrency from '~/util/format';

export default function RegistrationRegister() {
  const [loading, setLoading] = useState(false);

  const [plans, setPlans] = useState([]);

  const [students, setStudents] = useState([]);

  const [fullPrice, setFullPrice] = useState('');

  const [startDate, setStartDate] = useState([]);

  const [endDate, setEndDate] = useState('');

  const [registration, setRegistration] = useState('');

  useEffect(() => {
    async function loadPlans() {
      const { data } = await api.get('plans');

      const options = data.map(plan => ({ ...plan, key: 'plan' }));

      setPlans(options);
    }

    function loadDates() {
      const days = [];

      for (let x = 1; x < 30; x++) {
        const day = addDays(new Date(), x);

        days[x - 1] = {
          key: 'start_date',
          value: day,
          label: format(day, 'dd/MM/yy'),
        };
      }

      setStartDate(days);
    }

    loadDates();

    loadPlans();
  }, []);

  async function loadStudents(inputValue) {
    if (!inputValue) {
      const { data } = await api.get('students');

      const options = data.map(student => ({ ...student, key: 'student' }));

      setStudents(options);

      return options;
    }

    const studentOption = students.filter(student =>
      student.name.includes(inputValue)
    );

    return studentOption;
  }

  function handleChange(data) {
    switch (data.key) {
      case 'plan': {
        const newFullPrice = formatCurrency(data.price * data.duration);

        setFullPrice(newFullPrice);

        setRegistration({ ...registration, plan: data });

        if (!registration.start_date) {
          return;
        }

        const end_date = format(
          addMonths(registration.start_date, data.duration),
          'dd/MM/yy'
        );

        setEndDate(end_date);
        break;
      }
      case 'start_date': {
        setRegistration({ ...registration, start_date: data.value });

        if (!registration.plan) {
          return;
        }

        const end_date = format(
          addMonths(data.value, registration.plan.duration),
          'dd/MM/yy'
        );

        setEndDate(end_date);
        break;
      }
      case 'student': {
        setRegistration({
          ...registration,
          student: data,
        });
        break;
      }
      default:
    }
  }

  async function handleClick() {
    try {
      setLoading(true);

      const data = {
        plan_id: registration.plan.id,
        start_date: format(registration.start_date, 'MM/dd/yyyy'),
      };

      await api.put(`students/${registration.student.id}/registrations`, data);

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

          <ButtonSave type="button" onClick={handleClick}>
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

      <FormContent id="RegistrationRegister">
        <strong>ALUNO</strong>
        <AsyncSelect
          name="student"
          defaultOptions
          loadOptions={loadStudents}
          getOptionValue={option => option.id}
          getOptionLabel={option => option.name}
          placeholder="Buscar aluno"
          styles={StudentsSelect}
          components={{
            IndicatorSeparator: () => null,
          }}
          onChange={handleChange}
        />
        <FlexLine>
          <FlexColumn>
            <strong>PLANO</strong>
            <AsyncSelect
              onChange={handleChange}
              defaultOptions={plans}
              getOptionValue={option => option.id}
              getOptionLabel={option => option.title}
              components={{
                IndicatorSeparator: () => null,
              }}
              placeholder="Selecione plano"
              styles={DefaultSelect}
              name="plan"
            />
          </FlexColumn>
          <FlexColumn>
            <strong>DATA DE INÍCIO</strong>
            <AsyncSelect
              defaultOptions={startDate}
              onChange={handleChange}
              placeholder="Ecolha a data"
              styles={DefaultSelect}
              components={{
                IndicatorSeparator: () => null,
              }}
              name="start_date"
            />
          </FlexColumn>
          <FlexColumn>
            <strong>DATA DE TÉRMINO</strong>
            <InputContent disabled value={endDate || ''} />
          </FlexColumn>
          <FlexColumn>
            <strong>VALOR FINAL</strong>
            <InputContent disabled value={fullPrice || ''} />
          </FlexColumn>
        </FlexLine>
      </FormContent>
    </>
  );
}
