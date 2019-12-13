import * as Yup from 'yup';

import Help from '../models/Help';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class HelpController {
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

    const { answer } = req.body;

    const help = await Help.findByPk(id);

    await help.update(req.body);

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Questão Respondida!',
      template: 'question',
      context: {
        name,
        question: question.question,
        answer,
      },
    });

    return res.json(help);
  }
}

export default new HelpController();
