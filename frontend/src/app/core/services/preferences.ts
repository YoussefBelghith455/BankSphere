
import { Injectable, computed, effect, signal } from '@angular/core';

export type AppLanguage = 'en' | 'fr' | 'pt' | 'ar';
export type AppCurrency = 'EUR' | 'USD' | 'GBP' | 'TND';

interface UserPreferences {
  language: AppLanguage;
  currency: AppCurrency;
  notificationsEnabled: boolean;
  emailAlertsEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Preferences {
  private readonly storageKey = 'banksphere-preferences-v1';

  private readonly defaultPreferences: UserPreferences = {
    language: 'en',
    currency: 'EUR',
    notificationsEnabled: true,
    emailAlertsEnabled: true
  };

  private readonly preferences = signal<UserPreferences>(
    this.loadPreferences()
  );

  readonly language = computed(() => this.preferences().language);
  readonly currency = computed(() => this.preferences().currency);
  readonly notificationsEnabled = computed(
    () => this.preferences().notificationsEnabled
  );
  readonly emailAlertsEnabled = computed(
    () => this.preferences().emailAlertsEnabled
  );
  readonly isRtl = computed(() => this.language() === 'ar');

  constructor() {
    effect(() => {
      const preferences = this.preferences();

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify(preferences)
        );
      }
    });
  }

  setLanguage(language: AppLanguage): void {
    this.preferences.update(current => ({
      ...current,
      language
    }));
  }

  setCurrency(currency: AppCurrency): void {
    this.preferences.update(current => ({
      ...current,
      currency
    }));
  }

  setNotificationsEnabled(enabled: boolean): void {
    this.preferences.update(current => ({
      ...current,
      notificationsEnabled: enabled
    }));
  }

  setEmailAlertsEnabled(enabled: boolean): void {
    this.preferences.update(current => ({
      ...current,
      emailAlertsEnabled: enabled
    }));
  }

  private loadPreferences(): UserPreferences {
    if (typeof localStorage === 'undefined') {
      return { ...this.defaultPreferences };
    }

    try {
      const saved = localStorage.getItem(this.storageKey);

      if (!saved) {
        return { ...this.defaultPreferences };
      }

      const parsed: unknown = JSON.parse(saved);

      if (!parsed || typeof parsed !== 'object') {
        return { ...this.defaultPreferences };
      }

      const value = parsed as Partial<UserPreferences>;

      return {
        language: ['en', 'fr', 'pt', 'ar'].includes(value.language ?? '')
          ? value.language as AppLanguage
          : 'en',
        currency: ['EUR', 'USD', 'GBP', 'TND'].includes(value.currency ?? '')
          ? value.currency as AppCurrency
          : 'EUR',
        notificationsEnabled:
          typeof value.notificationsEnabled === 'boolean'
            ? value.notificationsEnabled
            : true,
        emailAlertsEnabled:
          typeof value.emailAlertsEnabled === 'boolean'
            ? value.emailAlertsEnabled
            : true
      };
    } catch {
      return { ...this.defaultPreferences };
    }
  }
}
