import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plan = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['id'],
    });

    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { title } = req.body;

    const plan = await Plan.findOne({
      where: { title },
    });

    if (plan) {
      return res.status(400).json({ error: 'Plan already exists. ' });
    }

    const { id, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists. ' });
    }

    const { title } = req.body;

    if (title) {
      if (title !== plan.title) {
        const titleExists = await Plan.findOne({ where: { title } });
        if (titleExists) {
          return res.status(400).json({ error: 'Plan already exists. ' });
        }
      }
    }

    await plan.update(req.body);

    return res.json({ plan });
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    await plan.destroy();

    return res.json();
  }
}

export default new PlanController();
