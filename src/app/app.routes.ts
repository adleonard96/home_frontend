import { Routes } from '@angular/router';
import { Telus } from './pages/telus/Telus';
import { Home } from './pages/home/Home';

export const routes: Routes = [
  {
    path: "",
    component: Home
  },
  {
    path: 'telus',
    component: Telus,
  },
];
