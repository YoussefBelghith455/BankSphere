
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banking } from '../../core/services/banking';
import { Currency } from '../../core/services/currency';
import { Translation } from '../../core/services/translation';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private readonly banking = inject(Banking);

  readonly currency = inject(Currency);
  readonly translation = inject(Translation);

  readonly totalBalance = this.banking.totalBalance;
  readonly balanceChange = 4.8;

  readonly transactions = computed(() => {
    const locale = {
      en: 'en-US',
      fr: 'fr-FR',
      pt: 'pt-PT',
      ar: 'ar-TN'
    }[this.translation.language()];

    return this.banking.transactions().slice(0, 3).map(transaction => ({
      id: transaction.id,
      name: transaction.name,
      date: new Date(
        transaction.date + 'T12:00:00'
      ).toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      amount: transaction.amount,
      icon: this.getTransactionIcon(transaction.category)
    }));
  });

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
