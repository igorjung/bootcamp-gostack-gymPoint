import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { student, plan, startDateFormated, endDateFormated } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula cadastrada!',
      template: 'enrollments',
      context: {
        student: student.name,
        plan: plan.title,
        price: plan.price,
        startDate: startDateFormated,
        endDate: endDateFormated,
      },
    });
  }
}

export default new EnrollmentMail();
