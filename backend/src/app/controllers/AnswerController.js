import * as Yup from 'yup';

import Help from '../models/Help';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import answerMail from '../jobs/answerMail';

class HelpController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Os dados inseridos não são valídos.',
      });
    }

    const { id } = req.params;

    const question = await Help.findByPk(id);

    if (!question) {
      return res
        .status(404)
        .json({ error: 'O pedido de auxílio não foi encontrado.' });
    }

    const { name, email } = await Student.findByPk(question.student_id);

    const { answer } = req.body;

    const help = await Help.findByPk(id);

    await help.update(req.body);

    await Queue.add(answerMail.key, {
      answer,
      name,
      email,
      question,
    });

    return res.json(help);
  }
}

export default new HelpController();
