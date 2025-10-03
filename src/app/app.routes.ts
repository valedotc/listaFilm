import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Form } from './form/form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'add',
    component: Form,
  },
  {
    path: 'edit/:id',
    component: Form,
  },
  { path: '**', redirectTo: 'home' },
];
