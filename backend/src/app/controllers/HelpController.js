import * as Yup from 'yup';

import Help from '../models/Help';
import Student from '../models/Student';

class HelpController {
  async index(req, res) {
    const { student, page = 1 } = req.query;

    if (student) {
      const help = await Help.findAll({
        where: { student_id: student },
        order: [['id', 'DESC']],
        limit: 7,
        offset: (page - 1) * 7,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name', 'email'],
          },
        ],
      });

      if (!help) {
        return res
          .status(404)
          .json({ error: 'Não existem pedidos de auxílio no momento.' });
      }

      return res.json(help);
    }

    const help = await Help.findAll({
      where: { answer: null },
      order: ['id'],
      limit: 7,
      offset: (page - 1) * 7,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!help) {
      return res
        .status(404)
        .json({ error: 'Não existem pedidos de auxílio no momento.' });
    }

    return res.json(help);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }

    const help = await Help.findOne({
      where: { id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!help) {
      return res
        .status(404)
        .json({ error: 'O pedido de auxílio não foi encontrado.' });
    }

    return res.json(help);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }

    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res
        .status(404)
        .json({ error: 'O estudante selecionado não existe.' });
    }

    const { question } = req.body;

    const help = await Help.create({
      question,
      student_id,
    });

    return res.json(help);
  }
}

export default new HelpController();
