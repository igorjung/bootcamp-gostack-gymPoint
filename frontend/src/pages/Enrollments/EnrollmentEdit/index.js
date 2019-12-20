import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';
import PropTypes from 'prop-types';
import { addDays, addMonths, format, parseISO } from 'date-fns';

import history from '~/services/history';
import api from '~/services/api';
import { FormContainer, InputContainer, FlexLine, FlexColumn } from '../styles';
import { NameSelect, PlanSelect } from '~/components/Select';
import DateInput from '~/components/DateInput';
import { Container, LinkBack, ButtonSave } from '~/styles/header';
import formatCurrency from '~/util/format';

export default function EnrollmentEdit({ match }) {
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [selectPlan, setSelectPlan] = useState('');

  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const { id } = match.params;
  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await api.get(`enrollments/${id}`);

        const start_date = parseISO(data.start_date);

        setEnrollments({ ...data, start_date });
      } catch (e) {
        if (e.response.data.error === undefined) {
          toast.error(`Um erro aconteceu, tente novamente mais tarde.`);
          history.push('/enrollments');
          return;
        }

        toast.error(e.response.data.error);
        history.push('/enrollments');
      }
    }

    async function loadPlans() {
      const { data } = await api.get('plans');

      setPlans(data);
    }

    loadData();

    loadPlans();
  }, [id]);

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
      const { id: plan_id } = formData.plan ? formData.plan : enrollments.plan;

      const { id: student_id } = formData.student
        ? formData.student
        : enrollments.student;

      const start_date = formData.start_date ? format(formData.start_date, 'MM/dd/yyyy') : format(enrollments.start_date, 'MM/dd/yyyy');

      setLoading(true);

      const data = {
        plan_id,
        start_date,
        student_id,
      };

      await api.put(`enrollments/${id}`, data);

      setLoading(false);

      history.push('/enrollments');

      toast.success('A matrícula foi editada com sucesso.');
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
        <h1>Edição de matrícula</h1>
        <div>
          <Link to="/enrollments">
            <LinkBack>
              <MdKeyboardArrowLeft color="#fff" size={20} />
              <strong>Voltar</strong>
            </LinkBack>
          </Link>

          <ButtonSave type="submit" form="enrollmentEdit">
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

      <FormContainer
        id="enrollmentEdit"
        onSubmit={handleSubmit}
        initialData={enrollments}
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
            <InputContainer
              name="end_date"
              type="text"
              disabled
              value={endDate || ''}
            />
          </FlexColumn>
          <FlexColumn>
            <strong>VALOR FINAL</strong>
            <InputContainer
              name="fullPrice"
              type="text"
              disabled
              value={fullPrice || ''}
            />
          </FlexColumn>
        </FlexLine>
      </FormContainer>
    </>
  );
}

EnrollmentEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
