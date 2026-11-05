
import { Component, inject } from '@angular/core';
import { Banking, BankAccount } from '../../core/services/banking';
import { Currency } from '../../core/services/currency';
import { Translation } from '../../core/services/translation';

@Component({
  selector: 'app-accounts',
  imports: [],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss'
})
export class Accounts {
  private readonly banking = inject(Banking);

  readonly currency = inject(Currency);
  readonly translation = inject(Translation);

  readonly accounts = this.banking.accounts;
  readonly totalBalance = this.banking.totalBalance;

  expandedAccountIds = new Set<number>();

  copiedAccountId: number | null = null;

  hoveredAccountId: number | null = null;

  get hoveredAccount(): BankAccount | null {
    return this.accounts().find(
      account => account.id === this.hoveredAccountId
    ) ?? null;
  }

  getAccountPercentage(balance: number): number {
    const total = this.totalBalance();

    if (total <= 0) {
      return 0;
    }

    return (balance / total) * 100;
  }

  toggleAccount(accountId: number): void {
    if (this.expandedAccountIds.has(accountId)) {
      this.expandedAccountIds.delete(accountId);
    } else {
      this.expandedAccountIds.add(accountId);
    }
  }

  async copyIban(accountId: number, iban: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(iban);
      this.copiedAccountId = accountId;
    } catch (error) {
      console.error('Failed to copy IBAN:', error);
    }
  }

  onDonutMouseMove(event: MouseEvent): void {
    const accounts = this.accounts();

    if (accounts.length !== 2 || this.totalBalance() <= 0) {
      this.hoveredAccountId = null;
      return;
    }

    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    const distance = Math.sqrt(x * x + y * y);
    const outerRadius = rect.width / 2;
    const innerRadius = outerRadius * 0.75;

    if (distance < innerRadius || distance > outerRadius) {
      this.hoveredAccountId = null;
      return;
    }

    const angle = (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;

    const checkingAngle =
      this.getAccountPercentage(accounts[0].balance) * 3.6;

    this.hoveredAccountId =
      angle < checkingAngle
        ? accounts[0].id
        : accounts[1].id;
  }

  onDonutMouseLeave(): void {
    this.hoveredAccountId = null;
  }
}
