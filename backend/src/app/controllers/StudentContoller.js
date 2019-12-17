import * as Yup from 'yup';

import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class StudentController {
  async index(req, res) {
    const { name, page = 1 } = req.query;

    if (!name) {
      if (page === '0') {
        const students = await Student.findAll({
          order: ['name'],
        });

        if (!students) {
          return res
            .status(404)
            .json({ error: 'Não há estudantes cadastrados no momento.' });
        }

        return res.json(students);
      }

      const students = await Student.findAll({
        order: ['name'],
        limit: 7,
        offset: (page - 1) * 7,
      });

      if (!students) {
        return res
          .status(404)
          .json({ error: 'Não há estudantes cadastrados no momento.' });
      }

      return res.json(students);
    }

    const student = await Student.findAll({
      where: {
        name,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    return res.json(student);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'O aluno selecionado não existe.' });
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
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }

    const student = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (student) {
      return res
        .status(401)
        .json({ error: 'Esse email já pertence a um aluno cadastrado. ' });
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
      return res
        .status(400)
        .json({ error: 'Os dados inserid.os não são valídos.' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res
        .status(404)
        .json({ error: 'O aluno selecionado não existe. ' });
    }

    const { email } = req.body;

    if (email) {
      if (email !== student.email) {
        const studentExists = await Student.findOne({ where: { email } });

        if (studentExists) {
          return res
            .status(401)
            .json({ error: 'Esse email pertence a um aluno já cadastrado. ' });
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
      return res.status(404).json({ error: 'O aluno selecionado não existe.' });
    }

    const registration = await Enrollment.findOne({
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
