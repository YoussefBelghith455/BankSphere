
import { Injectable, computed, effect, signal } from '@angular/core';

export type TransactionType = 'Income' | 'Expense' | 'Transfer';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface BankAccount {
  id: number;
  name: string;
  type: 'checking' | 'savings';
  iban: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'frozen';
}

export interface BankTransaction {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  account: string;
}

export interface TransferRequest {
  sourceAccountId: number;
  recipientName: string;
  recipientIban: string;
  amount: number;
  description: string;
}

interface BankingData {
  accounts: BankAccount[];
  transactions: BankTransaction[];
}

@Injectable({
  providedIn: 'root'
})
export class Banking {
  private readonly storageKey = 'banksphere-banking-v1';

  private readonly initialAccounts: BankAccount[] = [
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

  private readonly initialTransactions: BankTransaction[] = [
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

  private readonly savedData = this.loadData();

  private readonly accountsState = signal<BankAccount[]>(
    this.savedData?.accounts ?? this.initialAccounts
  );

  private readonly transactionsState = signal<BankTransaction[]>(
    this.savedData?.transactions ?? this.initialTransactions
  );

  readonly accounts = this.accountsState.asReadonly();
  readonly transactions = this.transactionsState.asReadonly();

  readonly totalBalance = computed(() =>
    this.accountsState().reduce(
      (total, account) => total + account.balance,
      0
    )
  );

  constructor() {
    effect(() => {
      const data: BankingData = {
        accounts: this.accountsState(),
        transactions: this.transactionsState()
      };

      this.saveData(data);
    });
  }

  private loadData(): BankingData | null {
    try {
      if (typeof localStorage === 'undefined') {
        return null;
      }

      const storedData = localStorage.getItem(this.storageKey);

      if (!storedData) {
        return null;
      }

      const parsedData: unknown = JSON.parse(storedData);

      if (
        typeof parsedData !== 'object' ||
        parsedData === null ||
        !('accounts' in parsedData) ||
        !('transactions' in parsedData) ||
        !Array.isArray(parsedData.accounts) ||
        !Array.isArray(parsedData.transactions)
      ) {
        return null;
      }

      const accounts = parsedData.accounts as BankAccount[];
      const transactions = parsedData.transactions as BankTransaction[];

      const validAccounts = accounts.every(account =>
        typeof account.id === 'number' &&
        typeof account.name === 'string' &&
        typeof account.iban === 'string' &&
        typeof account.balance === 'number' &&
        Number.isFinite(account.balance) &&
        (account.type === 'checking' || account.type === 'savings') &&
        typeof account.currency === 'string' &&
        ['active', 'inactive', 'frozen'].includes(account.status)
      );

      const validTransactions = transactions.every(transaction =>
        typeof transaction.id === 'number' &&
        typeof transaction.name === 'string' &&
        typeof transaction.category === 'string' &&
        typeof transaction.date === 'string' &&
        typeof transaction.amount === 'number' &&
        Number.isFinite(transaction.amount) &&
        ['Income', 'Expense', 'Transfer'].includes(transaction.type) &&
        ['Completed', 'Pending', 'Failed'].includes(transaction.status) &&
        typeof transaction.account === 'string'
      );

      if (!validAccounts || !validTransactions) {
        return null;
      }

      return { accounts, transactions };
    } catch {
      return null;
    }
  }

  private saveData(data: BankingData): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Unable to save banking data:', error);
    }
  }

  transfer(request: TransferRequest): void {
    const sourceAccount = this.accountsState().find(
      account => account.id === request.sourceAccountId
    );

    if (!sourceAccount) {
      throw new Error('Source account not found.');
    }

    const amountInCents = Math.round(request.amount * 100);

    if (
      !Number.isFinite(request.amount) ||
      request.amount <= 0 ||
      Math.abs(amountInCents / 100 - request.amount) > 0.0000001
    ) {
      throw new Error('Invalid transfer amount.');
    }

    const balanceInCents = Math.round(sourceAccount.balance * 100);

    if (amountInCents > balanceInCents) {
      throw new Error('Insufficient account balance.');
    }

    const recipientIban = request.recipientIban
      .replace(/\s/g, '')
      .toUpperCase();

    if (
      !request.recipientName.trim() ||
      !/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(recipientIban)
    ) {
      throw new Error('Invalid recipient details.');
    }

    const updatedAccounts = this.accountsState().map(account => {
      if (account.id === request.sourceAccountId) {
        return {
          ...account,
          balance: (balanceInCents - amountInCents) / 100
        };
      }

      return account;
    });

    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');

    const newTransaction: BankTransaction = {
      id: Date.now(),
      name: request.recipientName.trim(),
      category: request.description.trim() || 'Bank Transfer',
      date: localDate,
      amount: -amountInCents / 100,
      type: 'Transfer',
      status: 'Completed',
      account: sourceAccount.name
    };

    this.accountsState.set(updatedAccounts);

    this.transactionsState.update(transactions => [
      newTransaction,
      ...transactions
    ]);
  }

  resetDemoData(): void {
    this.accountsState.set(
      this.initialAccounts.map(account => ({ ...account }))
    );

    this.transactionsState.set(
      this.initialTransactions.map(transaction => ({ ...transaction }))
    );
  }
}
