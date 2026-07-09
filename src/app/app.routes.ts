import { Routes } from '@angular/router';
import {BelegList} from './beleg-list/beleg-list';
import {Beleg} from './beleg/beleg';

export const routes: Routes = [
  { path: '', component: BelegList },
  { path: 'neu', component: Beleg },
  { path: 'beleg/:id', component: Beleg },
  { path: '**', redirectTo: '' },
];
