
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Preferences,
  AppLanguage,
  AppCurrency
} from '../../core/services/preferences';
import { Translation } from '../../core/services/translation';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  private readonly router = inject(Router);
  private readonly preferences = inject(Preferences);

  readonly translation = inject(Translation);

  readonly selectedLanguage = this.preferences.language;
  readonly selectedCurrency = this.preferences.currency;
  readonly notificationsEnabled = this.preferences.notificationsEnabled;
  readonly emailAlertsEnabled = this.preferences.emailAlertsEnabled;

  updateLanguage(language: AppLanguage): void {
    this.preferences.setLanguage(language);
  }

  updateCurrency(currency: AppCurrency): void {
    this.preferences.setCurrency(currency);
  }

  updateNotifications(enabled: boolean): void {
    this.preferences.setNotificationsEnabled(enabled);
  }

  updateEmailAlerts(enabled: boolean): void {
    this.preferences.setEmailAlertsEnabled(enabled);
  }

  signOut(): void {
    this.router.navigate(['/login']);
  }
}
