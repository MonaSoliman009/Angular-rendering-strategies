import { Routes } from '@angular/router';
import { Csr } from './components/csr/csr';
import { Ssr } from './components/ssr/ssr';
import { Ssg } from './components/ssg/ssg';

export const routes: Routes = [
  { path: '', redirectTo: 'csr', pathMatch: 'full' },
  { path: 'csr', component: Csr },
  { path: 'ssr', component: Ssr },
  { path: 'ssg', component: Ssg },
];
