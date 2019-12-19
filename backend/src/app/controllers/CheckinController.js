import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'O estudante não foi encontrado.' });
    }

    const studentCheckins = await Checkin.findAll({
      where: {
        student_id,
      },
      limit: 8,
      offset: (page - 1) * 8,
    });

    if (!studentCheckins) {
      return res
        .status(404)
        .json({ error: 'O estudando não possuí matrículas.' });
    }

    return res.json(studentCheckins);
  }

  async store(req, res) {
    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'O estudando não existe.' });
    }

    const studentCheckins = await Checkin.findAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
    });

    if (studentCheckins) {
      if (studentCheckins.length >= 5) {
        return res.status(401).json({
          error: 'O estudante só pode fazer 5 pedidos em uma semana',
        });
      }
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
