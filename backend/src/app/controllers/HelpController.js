import * as Yup from 'yup';

import Help from '../models/Help';
import Student from '../models/Student';

class HelpController {
  async index(req, res) {
    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const help = await Help.findAll({ where: { student_id } });

    return res.json(help);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
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
