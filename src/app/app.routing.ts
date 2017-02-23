/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { HomeComponent } from './features/home.component';
import { NotFound404Component } from './not-found404.component';
import { A1Component } from './features/a1/a1.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'A1', component: A1Component },
  { path: 'A2', loadChildren: './features/a2/a2.module#A2Module' },
  { path: 'about', loadChildren: './features/about/index#AboutModule?sync=true' },
  { path: '**', component: NotFound404Component }
];
