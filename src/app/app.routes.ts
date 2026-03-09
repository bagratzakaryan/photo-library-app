import { Routes } from '@angular/router';

import { Photos } from './photos/photos';
import { Favorites } from './favorites/favorites';
import { Details } from './photos/details/details';

export const routes: Routes = [
  { path: '', component: Photos, title: 'Photos' },
  { path: 'photos', component: Photos, title: 'Photos' },
  { path: 'photos/:id', component: Details, title: 'Photo Details' },
  { path: 'favorites', component: Favorites, title: 'Favorites' },
  { path: '**', redirectTo: '' },
];
