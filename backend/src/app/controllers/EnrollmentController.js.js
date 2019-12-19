import * as Yup from 'yup';
import { isBefore, format, addMonths } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import enrollmentMail from '../jobs/enrollmentMail';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      order: [['id', 'DESC']],
      limit: 6,
      offset: (page - 1) * 6,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title'],
        },
      ],
    });

    if (!enrollments) {
      return res.status(404).json({ error: 'Não há matrículas ainda.' });
    }

    return res.json(enrollments);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos' });
    }

    const enrollments = await Enrollment.findOne({
      where: { id },
      attributes: ['id', 'start_date', 'end_date', 'active'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'id'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'id', 'price', 'duration'],
        },
      ],
    });

    if (!enrollments) {
      return res.status(404).json({ error: 'Matrícula não encontrada' });
    }

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }

    const { student_id } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'O estudante não foi encontrado.' });
    }

    const studentHasenrollments = await Enrollment.findOne({
      where: { student_id },
    });

    if (studentHasenrollments) {
      return res
        .status(401)
        .json({ error: 'Só é permitido uma matrícula por aluno.' });
    }

    const { plan_id } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({ error: 'O plano selecionado não existe.' });
    }

    const { price, duration } = plan;

    const { start_date } = req.body;

    const [month, day, year] = start_date.split('/');

    if (isBefore(new Date(year, month - 1, day), new Date())) {
      return res
        .status(400)
        .json({ error: 'Datas passadas não são permitidas' });
    }

    const end_date = addMonths(new Date(year, month - 1, day), duration);

    const endDateFormated = format(end_date, 'dd/MM/yyyy');

    const startDateFormated = format(
      new Date(year, month - 1, day),
      'dd/MM/yyyy'
    );

    const enrollments = await Enrollment.create({
      price,
      student_id,
      plan_id,
      start_date,
      end_date,
    });

    await Queue.add(enrollmentMail.key, {
      student,
      plan,
      startDateFormated,
      endDateFormated,
    });

    return res.json(enrollments);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }

    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res
        .status(404)
        .json({ error: 'A matrícula selecionado não existe.' });
    }

    const { student_id } = req.body;

    const hasEnrollment = await Enrollment.findOne({
      where: { student_id },
    });

    if (hasEnrollment && hasEnrollment.id !== enrollment.id) {
      return res
        .status(404)
        .json({ error: 'O estudante já possuí uma matrícula.' });
    }

    const { plan_id, start_date } = req.body;

    if (plan_id !== enrollment.plan_id) {
      const plan = await Plan.findByPk(plan_id);
      if (!plan) {
        return res
          .status(404)
          .json({ error: 'O plano selecionado não existe.' });
      }
    }

    const [month, day, year] = start_date.split('/');

    if (isBefore(new Date(year, month - 1, day), new Date())) {
      return res
        .status(400)
        .json({ error: 'Datas passadas não são permitidas.' });
    }

    const { duration, price } = await Plan.findByPk(plan_id);

    const end_date = addMonths(new Date(year, month - 1, day), duration);

    await enrollment.update({
      price,
      student_id,
      plan_id,
      start_date,
      end_date,
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const { id } = req.params;

    const enrollments = await Enrollment.findOne({ where: { id } });

    if (!enrollments) {
      return res.status(404).json({ error: 'A matrícula não foi encontrada.' });
    }

    await enrollments.destroy();

    return res.json();
  }
}

export default new EnrollmentController();
