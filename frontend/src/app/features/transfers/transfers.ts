
import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Banking } from '../../core/services/banking';

@Component({
  selector: 'app-transfers',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './transfers.html',
  styleUrl: './transfers.scss'
})
export class Transfers {
  private readonly banking = inject(Banking);
  private readonly formBuilder = inject(FormBuilder);

  readonly accounts = this.banking.accounts;

  showSuccessModal = false;
  transferError = '';

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

  get selectedAccount() {
    const accountId = Number(
      this.transferForm.controls.sourceAccountId.value
    );

    return this.accounts().find(
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
    this.transferError = '';

    if (
      this.transferForm.invalid ||
      this.hasInsufficientBalance
    ) {
      return;
    }

    const form = this.transferForm.getRawValue();

    try {
      this.banking.transfer({
        sourceAccountId: Number(form.sourceAccountId),
        recipientName: form.recipientName ?? '',
        recipientIban: form.recipientIban ?? '',
        amount: Number(form.amount),
        description: form.description ?? ''
      });

      this.showSuccessModal = true;
    } catch (error) {
      this.transferError =
        error instanceof Error
          ? error.message
          : 'Unable to complete the transfer.';
    }
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

    this.transferError = '';
  }
}
