import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  totalBalance = 12450.00;
  balanceChange = 4.8;

  
transactions = [
  {
    id: 1,
    name: 'Grocery Shopping',
    date: 'Oct 29, 2026',
    amount: -85.50,
    icon: '🛒'
  },
  {
    id: 2,
    name: 'Salary Payment',
    date: 'Oct 28, 2026',
    amount: 2850.00,
    icon: '💼'
  },
  {
    id: 3,
    name: 'Coffee Shop',
    date: 'Oct 27, 2026',
    amount: -6.80,
    icon: '☕'
  }
];

}