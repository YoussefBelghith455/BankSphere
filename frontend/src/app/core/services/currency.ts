
import { Injectable, computed, inject } from '@angular/core';
import { AppCurrency, Preferences } from './preferences';

@Injectable({
  providedIn: 'root'
})
export class Currency {
  private readonly preferences = inject(Preferences);

  private readonly demoRates: Record<AppCurrency, number> = {
    EUR: 1,
    USD: 1.10,
    GBP: 0.87,
    TND: 3.35
  };

  readonly selectedCurrency = this.preferences.currency;

  readonly exchangeRate = computed(() => {
    return this.demoRates[this.selectedCurrency()];
  });

  convert(amountInEur: number): number {
    return amountInEur * this.exchangeRate();
  }

  format(amountInEur: number): string {
    const currency = this.selectedCurrency();
    const convertedAmount = this.convert(amountInEur);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedAmount);
  }
}
