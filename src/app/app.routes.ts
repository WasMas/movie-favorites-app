import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'movies',
    loadComponent: () => import('./movies/movies.page').then((m) => m.MoviesPage),
  },
  {
    path: 'matching',
    loadComponent: () =>
      import('./matching/matching.page').then((m) => m.MatchingPage),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage),
  },
];
