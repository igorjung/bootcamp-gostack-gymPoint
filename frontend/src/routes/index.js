import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '~/pages/SignIn';
import Students from '~/pages/Students';
import StudentRegister from '~/pages/Students/StudentRegister';
import StudentEdit from '~/pages/Students/StudentEdit';
import Plans from '~/pages/Plans';
import PlanRegister from '~/pages/Plans/PlanRegister';
import PlanEdit from '~/pages/Plans/PlanEdit';
import Enrollments from '~/pages/Enrollments';
import EnrollmentRegister from '~/pages/Enrollments/EnrollmentRegister';
import EnrollmentEdit from '~/pages/Enrollments/EnrollmentEdit';
import Help_orders from '~/pages/Help_Orders';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/students" exact component={Students} isPrivate />
      <Route path="/students/register" component={StudentRegister} isPrivate />
      <Route path="/students/:id" component={StudentEdit} isPrivate />

      <Route path="/plans" exact component={Plans} isPrivate />
      <Route path="/plans/register" component={PlanRegister} isPrivate />
      <Route path="/plans/:id" component={PlanEdit} isPrivate />

      <Route path="/enrollments" exact component={Enrollments} isPrivate />
      <Route
        path="/enrollments/register"
        component={EnrollmentRegister}
        isPrivate
      />
      <Route path="/enrollments/:id" component={EnrollmentEdit} isPrivate />

      <Route path="/helporders" exact component={Help_orders} isPrivate />
    </Switch>
  );
}
