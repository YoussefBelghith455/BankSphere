
import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

interface TransferAccount {
  id: number;
  name: string;
  iban: string;
  balance: number;
}

@Component({
  selector: 'app-transfers',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './transfers.html',
  styleUrl: './transfers.scss'
})
export class Transfers {
  accounts: TransferAccount[] = [
    {
      id: 1,
      name: 'Checking Account',
      iban: 'PT50 0000 0000 0000 0000 0000 0',
      balance: 8450
    },
    {
      id: 2,
      name: 'Savings Account',
      iban: 'PT50 1111 1111 1111 1111 1111 1',
      balance: 4000
    }
  ];

  showSuccessModal = false;

  private formBuilder = new FormBuilder();

  transferForm = this.formBuilder.group({
    sourceAccountId: [1, Validators.required],
    recipientName: ['', Validators.required],
    recipientIban: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Z]{2}[0-9A-Z]{13,32}$/)
      ]
    ],
    amount: [
      null as number | null,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],
    description: ['', Validators.maxLength(140)]
  });

  get selectedAccount(): TransferAccount | undefined {
    const accountId = Number(
      this.transferForm.controls.sourceAccountId.value
    );

    return this.accounts.find(
      account => account.id === accountId
    );
  }

  get hasInsufficientBalance(): boolean {
    const amount = Number(
      this.transferForm.controls.amount.value
    );

    return amount > 0 &&
      amount > (this.selectedAccount?.balance ?? 0);
  }

  submitTransfer(): void {
    this.transferForm.markAllAsTouched();

    if (
      this.transferForm.invalid ||
      this.hasInsufficientBalance
    ) {
      return;
    }

    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.resetTransfer();
  }

  resetTransfer(): void {
    this.transferForm.reset({
      sourceAccountId: 1,
      recipientName: '',
      recipientIban: '',
      amount: null,
      description: ''
    });
  }
}
