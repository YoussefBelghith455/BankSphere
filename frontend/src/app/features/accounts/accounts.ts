
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface BankAccount {
  id: number;
  name: string;
  type: 'checking' | 'savings';
  iban: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'frozen';
}

@Component({
  selector: 'app-accounts',
  imports: [CurrencyPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss'
})
export class Accounts {
  accounts: BankAccount[] = [
    {
      id: 1,
      name: 'Checking Account',
      type: 'checking',
      iban: 'PT50 0000 0000 0000 0000 0000 0',
      balance: 8450,
      currency: 'EUR',
      status: 'active'
    },
    {
      id: 2,
      name: 'Savings Account',
      type: 'savings',
      iban: 'PT50 1111 1111 1111 1111 1111 1',
      balance: 4000,
      currency: 'EUR',
      status: 'active'
    }
  ];

  expandedAccountIds = new Set<number>();

  copiedAccountId: number | null = null;

  hoveredAccount: BankAccount | null = null;

  get totalBalance(): number {
    return this.accounts.reduce(
      (total, account) => total + account.balance,
      0
    );
  }

  getAccountPercentage(balance: number): number {
    if (this.totalBalance <= 0) {
      return 0;
    }

    return (balance / this.totalBalance) * 100;
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
    if (this.accounts.length !== 2 || this.totalBalance <= 0) {
      this.hoveredAccount = null;
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
      this.hoveredAccount = null;
      return;
    }

    const angle = (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;

    const checkingAngle =
      this.getAccountPercentage(this.accounts[0].balance) * 3.6;

    this.hoveredAccount =
      angle < checkingAngle
        ? this.accounts[0]
        : this.accounts[1];
  }

  onDonutMouseLeave(): void {
    this.hoveredAccount = null;
  }
}
