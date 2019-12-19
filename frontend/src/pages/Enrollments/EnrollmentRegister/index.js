import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';
import { addMonths, addDays, format } from 'date-fns';
import * as Yup from 'yup';

import { NameSelect, PlanSelect } from '~/components/Select';
import DateInput from '~/components/DateInput';
import { Container, LinkBack, ButtonSave } from '~/styles/header';
import { FormContainer, InputContainer, FlexLine, FlexColumn } from '../styles';
import history from '~/services/history';
import api from '~/services/api';
import formatCurrency from '~/util/format';

const Schema = Yup.object().shape({
  student: Yup.object()
    .shape({
      id: Yup.number().integer(),
    })
    .typeError('O nome é obrigatório')
    .required('O nome é obrigatório'),
  plan: Yup.object()
    .shape({
      id: Yup.number().integer(),
    })
    .typeError('O plano é obrigatório')
    .required('O plano é obrigatório'),
  start_date: Yup.date()
    .typeError('A data é obrigatória')
    .required('A data é obrigatória'),
});

export default function EnrollmentRegister() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [selectPlan, setSelectPlan] = useState('');

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

  const endDate = useMemo(() => {
    const { duration } = selectPlan;
    if (duration && startDate) {
      return format(addMonths(startDate, duration), 'dd/MM/yy');
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

  async function handleSubmit(formData) {
    try {
      const { id: student_id } = formData.student;

      const { id: plan_id } = formData.plan;

      const start_date = format(formData.start_date, 'MM/dd/yyyy');

      setLoading(true);

      const data = {
        plan_id,
        start_date,
        student_id,
      };

      await api.post(`enrollments`, data);

      setLoading(false);

      history.push('/enrollments');

      toast.success('A matrícula foi cadastrada com sucesso.');
    } catch (e) {
      setLoading(false);

      if (e.response.data.error === undefined) {
        toast.error(`Um erro aconteceu, tente novamente mais tarde.`);
        return;
      }

      toast.error(`${e.response.data.error}`);
    }
  }

  return (
    <>
      <Container>
        <h1>Cadastro de matrícula</h1>
        <div>
          <Link to="/enrollments">
            <LinkBack>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <strong>Voltar</strong>
            </LinkBack>
          </Link>

          <ButtonSave type="submit" form="enrollmentsRegister">
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

      <FormContainer
        schema={Schema}
        id="enrollmentsRegister"
        onSubmit={handleSubmit}
      >
        <strong>ALUNO</strong>
        <NameSelect name="student" loadOptions={loadStudents} />
        <FlexLine>
          <FlexColumn>
            <strong>PLANO</strong>
            <PlanSelect name="plan" options={plans} setChange={setSelectPlan} />
          </FlexColumn>
          <FlexColumn>
            <strong>DATA DE INÍCIO</strong>
            <DateInput
              name="start_date"
              min={minDate}
              setChange={e => setStartDate(e)}
            />
          </FlexColumn>
          <FlexColumn>
            <strong>DATA DE TÉRMINO</strong>
            <InputContainer type="text" disabled value={endDate} />
          </FlexColumn>
          <FlexColumn>
            <strong>VALOR FINAL</strong>
            <InputContainer type="text" disabled value={fullPrice} />
          </FlexColumn>
        </FlexLine>
      </FormContainer>
    </>
  );
}
