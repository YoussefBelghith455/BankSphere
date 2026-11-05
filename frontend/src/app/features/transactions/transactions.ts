
import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type TransactionType = 'Income' | 'Expense' | 'Transfer';
type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

interface Transaction {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  account: string;
}

@Component({
  selector: 'app-transactions',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions {
  transactions: Transaction[] = [
    {
      id: 1,
      name: 'Monthly Salary',
      category: 'Salary',
      date: '2026-11-01',
      amount: 3200,
      type: 'Income',
      status: 'Completed',
      account: 'Checking Account'
    },
    {
      id: 2,
      name: 'Continente',
      category: 'Groceries',
      date: '2026-10-30',
      amount: -85.40,
      type: 'Expense',
      status: 'Completed',
      account: 'Checking Account'
    },
    {
      id: 3,
      name: 'Netflix Subscription',
      category: 'Entertainment',
      date: '2026-10-28',
      amount: -15.99,
      type: 'Expense',
      status: 'Completed',
      account: 'Checking Account'
    },
    {
      id: 4,
      name: 'Savings Deposit',
      category: 'Internal Transfer',
      date: '2026-10-25',
      amount: -500,
      type: 'Transfer',
      status: 'Completed',
      account: 'Checking Account'
    },
    {
      id: 5,
      name: 'Freelance Payment',
      category: 'Business',
      date: '2026-10-22',
      amount: 750,
      type: 'Income',
      status: 'Completed',
      account: 'Checking Account'
    },
    {
      id: 6,
      name: 'Electricity Bill',
      category: 'Utilities',
      date: '2026-10-20',
      amount: -62.80,
      type: 'Expense',
      status: 'Pending',
      account: 'Checking Account'
    },
    {
      id: 7,
      name: 'Restaurant Payment',
      category: 'Dining',
      date: '2026-10-18',
      amount: -48.50,
      type: 'Expense',
      status: 'Completed',
      account: 'Checking Account'
    },
    {
      id: 8,
      name: 'Online Purchase',
      category: 'Shopping',
      date: '2026-10-15',
      amount: -129.99,
      type: 'Expense',
      status: 'Failed',
      account: 'Checking Account'
    },
    {
      id: 9,
      name: 'Interest Payment',
      category: 'Interest',
      date: '2026-10-12',
      amount: 12.35,
      type: 'Income',
      status: 'Completed',
      account: 'Savings Account'
    },
    {
      id: 10,
      name: 'Rent Payment',
      category: 'Housing',
      date: '2026-10-05',
      amount: -650,
      type: 'Expense',
      status: 'Completed',
      account: 'Checking Account'
    },
    {
      id: 11,
      name: 'Mobile Plan',
      category: 'Telecommunications',
      date: '2026-10-03',
      amount: -19.99,
      type: 'Expense',
      status: 'Completed',
      account: 'Checking Account'
    },
    {
      id: 12,
      name: 'Refund Received',
      category: 'Refund',
      date: '2026-09-28',
      amount: 45.90,
      type: 'Income',
      status: 'Completed',
      account: 'Checking Account'
    }
  ];

  searchTerm = '';
  selectedType = 'All';
  selectedStatus = 'All';
  selectedDate = '';

  currentPage = 1;
  pageSize = 5;

  get filteredTransactions(): Transaction[] {
    return this.transactions.filter(transaction => {
      const search = this.searchTerm.toLowerCase().trim();

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

      return matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesDate;
    });
  }

  get paginatedTransactions(): Transaction[] {
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
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  get totalExpenses(): number {
    return this.filteredTransactions
      .filter(transaction =>
        transaction.amount < 0 &&
        transaction.status === 'Completed'
      )
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  }

  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
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
