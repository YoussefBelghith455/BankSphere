
import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Accounts } from './features/accounts/accounts';
import { Transfers } from './features/transfers/transfers';
import { Transactions } from './features/transactions/transactions';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { ForgotPassword } from './features/forgot-password/forgot-password';
import { Settings } from './features/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'dashboard', component: Dashboard },
  { path: 'accounts', component: Accounts },
  { path: 'transfers', component: Transfers },
  { path: 'transactions', component: Transactions },
  { path: 'settings', component: Settings },
  { path: '**', redirectTo: 'login' }
];
