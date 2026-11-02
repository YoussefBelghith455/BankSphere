import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Accounts } from './features/accounts/accounts';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'accounts', component: Accounts },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];