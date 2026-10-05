import { Routes } from '@angular/router';
import { TimeTracking } from './pages/timeTracking/TimeTracking';
import { Home } from './pages/home/Home';
import { BattlefieldSeason } from './pages/battlefieldSeason/BattlefieldSeason';

export const routes: Routes = [
  {
    path: "",
    component: Home
  },
  {
    path: 'timeTracking',
    component: TimeTracking,
  },
  {
    path: 'battlefield-season',
    component: BattlefieldSeason,
  },
];
