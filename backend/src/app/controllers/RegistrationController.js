import * as Yup from 'yup';
import { isBefore, format, addMonths } from 'date-fns';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      order: ['id'],
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

    if (!registrations) {
      return res.status(400).json({ error: 'There are not registrations yet' });
    }

    return res.json(registrations);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const registration = await Registration.findOne({
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

    if (!registration) {
      return res.status(400).json({ error: 'Registration not found' });
    }

    return res.json(registration);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const studentHasRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (studentHasRegistration) {
      return res
        .status(400)
        .json({ error: 'Only one registration for each Student' });
    }

    const { plan_id } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const { price, duration } = plan;

    const { start_date } = req.body;

    const [month, day, year] = start_date.split('/');

    if (isBefore(new Date(year, month - 1, day), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(new Date(year, month - 1, day), duration);

    const endDateFormated = format(end_date, 'dd/MM/yyyy');

    const startDateFormated = format(
      new Date(year, month - 1, day),
      'dd/MM/yyyy'
    );

    const registration = await Registration.create({
      price,
      student_id,
      plan_id,
      start_date,
      end_date,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula cadastrada!',
      text: ` Parabéns ${student.name}, sua matricula no plano ${plan.title} foi cadastrada com início em ${startDateFormated} e com termino em ${endDateFormated}`,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const studentRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (!studentRegistration) {
      return res
        .status(400)
        .json({ error: 'Student does not have Registration' });
    }

    const { plan_id, start_date } = req.body;

    if (plan_id !== studentRegistration.plan_id) {
      const plan = await Plan.findByPk(plan_id);
      if (!plan) {
        return res.status(400).json({ error: 'Plan does not exists' });
      }
    }

    const [month, day, year] = start_date.split('/');

    if (isBefore(new Date(year, month - 1, day), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const { duration, price } = await Plan.findByPk(plan_id);

    const end_date = addMonths(new Date(year, month - 1, day), duration);

    const registration = await Registration.findByPk(studentRegistration.id);

    await registration.update({
      price,
      student_id,
      plan_id,
      start_date,
      end_date,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const { id } = req.params;

    const registration = await Registration.findOne({ where: { id } });

    if (!registration) {
      return res.status(400).json({ error: 'Registration not found' });
    }

    await registration.destroy();

    return res.json();
  }
}

export default new RegistrationController();
