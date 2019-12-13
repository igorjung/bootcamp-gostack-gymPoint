import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student does not exists' });
    }

    const studentCheckins = await Checkin.findAll({
      where: {
        student_id,
      },
    });

    if (!studentCheckins) {
      return res.status(404).json({ error: 'Student does not have checkins' });
    }

    return res.json(studentCheckins);
  }

  async store(req, res) {
    const student_id = req.params.id;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: 'Student does not exists' });
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
          error: 'Student can make only 5 chekins in a period of 7 days',
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
