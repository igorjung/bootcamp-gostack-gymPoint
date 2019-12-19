import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { name, email, question, answer } = data;

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
  }
}

export default new AnswerMail();
