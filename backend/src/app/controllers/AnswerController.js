import * as Yup from 'yup';

import Help from '../models/Help';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class HelpController {
  async index(req, res) {
    const help = await Help.findAll({ where: { answer: null } });

    return res.json(help);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const question = await Help.findByPk(id);

    if (!question) {
      return res.status(400).json({ error: 'Help order does not exists' });
    }

    const { name, email } = await Student.findByPk(question.student_id);

    console.log(name, email);

    const { answer } = req.body;

    const help = await Help.create({
      answer,
      answer_at: new Date(),
      question: question.question,
      student_id: question.student_id,
    });

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Questão Respondida!',
      text: ` Caro ${name}, A sua questão "${question.question}" foi respondida com "${answer}".`,
    });

    return res.json(help);
  }
}

export default new HelpController();
