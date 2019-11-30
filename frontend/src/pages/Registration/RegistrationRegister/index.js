import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { addDays, addMonths, format } from 'date-fns';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';

import * as Yup from 'yup';
import { FormContent, InputContent, FlexLine, FlexColumn } from '../styles';

import history from '~/services/history';
import api from '~/services/api';

import { Container, LinkBack, ButtonSave } from '~/styles/header';
import { StudentsSelect, DefaultSelect } from '~/styles/asyncSelect';

import formatCurrency from '~/util/format';

const Schema = Yup.object().shape({
  student: Yup.string().required('O nome é obrigatório'),
  plan: Yup.string().required('O plano é obrigatório'),
  start_data: Yup.string().required('A data inicial é obrigatória'),
});

export default function PlanRegister() {
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

      const plansOptions = data.map(plan => ({
        name: 'plan',
        label: plan.title,
        value: plan,
      }));

      setPlans(plansOptions);
    }

    function loadDates() {
      const days = [];

      for (let x = 1; x < 30; x++) {
        const day = addDays(new Date(), x);

        days[x] = {
          name: 'start_date',
          value: day,
          label: format(day, 'dd/MM/yy'),
        };
      }

      setStartDate(days);
    }

    loadDates();

    loadPlans();
  }, []);

  async function studentOptions(inputValue) {
    if (!inputValue) {
      const response = await api.get('students');

      const studentsOptions = response.data.map(student => ({
        id: student.id,
        title: student.name,
      }));

      console.log(studentsOptions);

      setStudents(studentsOptions);

      return studentsOptions;
    }

    const studentOption = students.filter(student =>
      student.title.includes(inputValue)
    );

    return studentOption;
  }

  function handleChange(data) {
    switch (data.name) {
      case 'plan': {
        const { value } = data;

        const newFullPrice = formatCurrency(value.price * value.duration);

        setFullPrice(newFullPrice);

        setRegistration({ ...registration, plan: data.value });

        if (!registration.start_date) {
          return;
        }

        const end_date = format(
          addMonths(registration.start_date, data.value.duration),
          'dd/MM/yy'
        );

        setEndDate(end_date);
        break;
      }
      case 'start_date': {
        const { value } = data;

        setRegistration({ ...registration, start_date: data.value });

        if (!registration.plan) {
          return;
        }

        const end_date = format(
          addMonths(value, registration.plan.duration),
          'dd/MM/yy'
        );

        setEndDate(end_date);
        break;
      }
      case 'student': {
        setRegistration({
          ...registration,
          student: data.value,
        });
        break;
      }
      default:
    }
  }

  function handleSubmit(data) {
    console.log('AAAA');
    console.log(data);
  }

  async function handleClick() {
    try {
      setLoading(true);

      const data = {
        plan_id: registration.plan.id,
        start_date: format(registration.start_date, 'MM/dd/yyyy'),
      };

      await api.post(`students/${registration.student.id}/registrations`, data);

      setLoading(false);

      history.push('/registrations');

      toast.success('A matrícula foi criado com sucesso.');
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

          <ButtonSave form="RegistrationRegister" type="submit">
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

      <FormContent id="RegistrationRegister" onSubmit={handleSubmit}>
        <strong>ALUNO</strong>
        <AsyncSelect
          name="student"
          defaultOptions
          loadOptions={studentOptions}
          getOptionValue={option => option.id}
          getOptionLabel={option => option.title}
          placeholder="Buscar aluno"
          styles={StudentsSelect}
          components={{
            IndicatorSeparator: () => null,
          }}
          onChange={handleChange}
          form="RegistrationRegister"
        />
        <FlexLine>
          <FlexColumn>
            <strong>PLANO</strong>
            <AsyncSelect
              onChange={handleChange}
              defaultOptions={plans}
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
              components={{
                IndicatorSeparator: () => null,
              }}
              defaultOptions={startDate}
              onChange={handleChange}
              placeholder="Ecolha a data"
              styles={DefaultSelect}
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
