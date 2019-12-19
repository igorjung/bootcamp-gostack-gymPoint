import * as Yup from 'yup';

import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';

class PlanController {
  async index(req, res) {
    const { id, page = 1 } = req.query;

    if (id) {
      const plan = await Plan.findOne({
        where: { id },
        attributes: ['id', 'title', 'duration', 'price'],
      });

      if (!plan) {
        return res.status(404).json({ error: 'Plan not found.' });
      }

      return res.json(plan);
    }

    if (page === '0') {
      const plan = await Plan.findAll({
        attributes: ['id', 'title', 'duration', 'price'],
        order: ['price'],
      });

      if (!plan) {
        return res.status(404).json({ error: 'Não planos no momento.' });
      }

      return res.json(plan);
    }

    const plan = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['price'],
      limit: 7,
      offset: (page - 1) * 7,
    });

    if (!plan) {
      return res.status(404).json({ error: 'There are no plans yet.' });
    }

    return res.json(plan);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'O plano selecionado não existe.' });
    }

    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }
    const { title } = req.body;

    const plan = await Plan.findOne({
      where: { title },
    });

    if (plan) {
      return res
        .status(400)
        .json({ error: 'Esse título já pertence a um plano existente. ' });
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
      return res
        .status(400)
        .json({ error: 'Os dados inseridos não são valídos.' });
    }

    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res
        .status(404)
        .json({ error: 'O plano selecionado não existe. ' });
    }

    const { title } = req.body;

    if (title) {
      if (title !== plan.title) {
        const titleExists = await Plan.findOne({ where: { title } });
        if (titleExists) {
          return res
            .status(400)
            .json({ error: 'Esse título já pertence a um plano existente. ' });
        }
      }
    }

    await plan.update(req.body);

    return res.json({ plan });
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'O plano selecionado não existe.' });
    }

    await Enrollment.destroy({
      where: { plan_id: id },
    });

    await plan.destroy();

    return res.json();
  }
}

export default new PlanController();
