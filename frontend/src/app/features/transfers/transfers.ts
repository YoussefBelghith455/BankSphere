
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Banking } from '../../core/services/banking';
import { Currency } from '../../core/services/currency';
import { Translation } from '../../core/services/translation';

@Component({
  selector: 'app-transfers',
  imports: [ReactiveFormsModule],
  templateUrl: './transfers.html',
  styleUrl: './transfers.scss'
})
export class Transfers {
  private readonly banking = inject(Banking);
  private readonly formBuilder = inject(FormBuilder);

  readonly currency = inject(Currency);
  readonly translation = inject(Translation);
  readonly accounts = this.banking.accounts;

  showSuccessModal = false;
  transferError = '';

  private confirmedTransferAmount = 0;
  private confirmedTransferCurrency = '';
  private confirmedRecipientName = '';
  private confirmedSourceAccountName = '';

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

  get transferAmount(): number {
    return Number(
      this.transferForm.controls.amount.value
    ) || 0;
  }

  get transferAmountInEur(): number {
    const rate = this.currency.exchangeRate();

    if (rate <= 0) {
      return 0;
    }

    return this.transferAmount / rate;
  }

  get hasInsufficientBalance(): boolean {
    return this.transferAmountInEur > 0 &&
      this.transferAmountInEur >
        (this.selectedAccount?.balance ?? 0);
  }

  get formattedTransferAmount(): string {
    return this.currency.format(this.transferAmountInEur);
  }

  get formattedConfirmedAmount(): string {
    const locale = {
      en: 'en-US',
      fr: 'fr-FR',
      pt: 'pt-PT',
      ar: 'ar-TN'
    }[this.translation.language()];

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.confirmedTransferCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(this.confirmedTransferAmount);
  }

  get confirmedRecipient(): string {
    return this.confirmedRecipientName;
  }

  get confirmedSourceAccount(): string {
    return this.confirmedSourceAccountName;
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

    const amountInEur = this.transferAmountInEur;
    const amountInSelectedCurrency = this.transferAmount;
    const selectedCurrency = this.currency.selectedCurrency();
    const recipientName = form.recipientName ?? '';
    const sourceAccountName = this.selectedAccount?.name ?? '';

    try {
      this.banking.transfer({
        sourceAccountId: Number(form.sourceAccountId),
        recipientName,
        recipientIban: form.recipientIban ?? '',
        amount: amountInEur,
        description: form.description ?? ''
      });

      this.confirmedTransferAmount = amountInSelectedCurrency;
      this.confirmedTransferCurrency = selectedCurrency;
      this.confirmedRecipientName = recipientName;
      this.confirmedSourceAccountName = sourceAccountName;

      this.showSuccessModal = true;
    } catch (error) {
      this.transferError =
        error instanceof Error
          ? error.message
          : this.translation.translate('transfers.unableToComplete');
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
