import * as Yup from 'yup';

import Student from '../models/Student';
import Registration from '../models/Registration';

class StudentController {
  async index(req, res) {
    const { name } = req.query;

    if (!name) {
      const students = await Student.findAll({
        order: ['id'],
      });

      if (!students) {
        return res.status(404).json({ error: 'There are not students yet' });
      }

      return res.json(students);
    }

    const student = await Student.findOne({
      where: {
        name,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    return res.json(student);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    return res.json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (student) {
      return res.status(401).json({ error: 'Student already exists. ' });
    }

    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, age, height, weight });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student does not exists. ' });
    }

    const { email } = req.body;

    if (email) {
      if (email !== student.email) {
        const studentExists = await Student.findOne({ where: { email } });

        if (studentExists) {
          return res.status(401).json({ error: 'Student already exists. ' });
        }
      }
    }

    await student.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student does not exists' });
    }

    const registration = await Registration.findOne({
      where: { student_id: id },
    });

    if (registration) {
      await registration.destroy();
    }

    await student.destroy();

    return res.json();
  }
}

export default new StudentController();
