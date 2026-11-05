import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Accounts } from './features/accounts/accounts';
import { Transfers } from './features/transfers/transfers';
import { Transactions } from './features/transactions/transactions';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'accounts', component: Accounts },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {path: 'transfers',component: Transfers},
  {path: 'transactions',component: Transactions}
];