
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Banking,
  BankTransaction
} from '../../core/services/banking';
import { Currency } from '../../core/services/currency';
import { Translation } from '../../core/services/translation';

@Component({
  selector: 'app-transactions',
  imports: [FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions {
  private readonly banking = inject(Banking);

  readonly currency = inject(Currency);
  readonly translation = inject(Translation);
  readonly transactions = this.banking.transactions;

  searchTerm = '';
  selectedType = 'All';
  selectedStatus = 'All';
  selectedDate = '';

  currentPage = 1;
  pageSize = 5;

  get filteredTransactions(): BankTransaction[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.transactions().filter(transaction => {
      const matchesSearch =
        transaction.name.toLowerCase().includes(search) ||
        transaction.category.toLowerCase().includes(search) ||
        transaction.account.toLowerCase().includes(search);

      const matchesType =
        this.selectedType === 'All' ||
        transaction.type === this.selectedType;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        transaction.status === this.selectedStatus;

      const matchesDate =
        !this.selectedDate ||
        transaction.date === this.selectedDate;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesDate
      );
    });
  }

  get paginatedTransactions(): BankTransaction[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredTransactions.slice(
      start,
      start + this.pageSize
    );
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredTransactions.length / this.pageSize)
    );
  }

  get totalIncome(): number {
    return this.filteredTransactions
      .filter(transaction =>
        transaction.amount > 0 &&
        transaction.status === 'Completed'
      )
      .reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
  }

  get totalExpenses(): number {
    return this.filteredTransactions
      .filter(transaction =>
        transaction.amount < 0 &&
        transaction.status === 'Completed'
      )
      .reduce(
        (sum, transaction) =>
          sum + Math.abs(transaction.amount),
        0
      );
  }

  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  getTransactionType(type: string): string {
    switch (type) {
      case 'Income':
        return this.translation.translate('transactions.income');
      case 'Expense':
        return this.translation.translate('transactions.expense');
      case 'Transfer':
        return this.translation.translate('transactions.transfer');
      default:
        return type;
    }
  }

  getTransactionStatus(status: string): string {
    switch (status) {
      case 'Completed':
        return this.translation.translate('transactions.completed');
      case 'Pending':
        return this.translation.translate('transactions.pending');
      case 'Failed':
        return this.translation.translate('transactions.failed');
      default:
        return status;
    }
  }

  formatDate(date: string): string {
    const locale = {
      en: 'en-US',
      fr: 'fr-FR',
      pt: 'pt-PT',
      ar: 'ar-TN'
    }[this.translation.language()];

    return new Date(date + 'T12:00:00').toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'All';
    this.selectedStatus = 'All';
    this.selectedDate = '';
    this.currentPage = 1;
  }
}
