import { Routes } from '@angular/router';
import {BelegList} from './beleg-list/beleg-list';
import {BelegForm} from './beleg-form/beleg-form';

export const routes: Routes = [
  { path: '', component: BelegList },
  { path: 'neu', component: BelegForm },
  { path: 'beleg/:id', component: BelegForm }
];
