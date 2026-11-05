
import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banking } from '../../core/services/banking';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private readonly banking = inject(Banking);

  readonly totalBalance = this.banking.totalBalance;

  readonly balanceChange = 4.8;

  readonly transactions = computed(() =>
    this.banking.transactions().slice(0, 3).map(transaction => ({
      id: transaction.id,
      name: transaction.name,
      date: new Date(
        transaction.date + 'T12:00:00'
      ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      amount: transaction.amount,
      icon: this.getTransactionIcon(transaction.category)
    }))
  );

  private getTransactionIcon(category: string): string {
    const value = category.toLowerCase();

    if (value.includes('grocery') || value.includes('shopping')) {
      return '🛒';
    }

    if (value.includes('salary') || value.includes('work')) {
      return '💼';
    }

    if (value.includes('restaurant') || value.includes('food')) {
      return '🍽️';
    }

    if (value.includes('transfer')) {
      return '💸';
    }

    if (value.includes('subscription') || value.includes('netflix')) {
      return '📺';
    }

    return '💳';
  }
}
