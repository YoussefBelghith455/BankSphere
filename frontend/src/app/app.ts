
import { Component, computed, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Sidebar } from './layout/sidebar/sidebar';
import { MobileHeader } from './layout/mobile-header/mobile-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, MobileHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd =>
        event instanceof NavigationEnd
      ),
      map(event => event.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );


  readonly isAuthPage = computed(() => {
    const path = this.currentUrl().split(/[?#]/)[0];

    return [
      '/login',
      '/register',
      '/forgot-password'
    ].includes(path);
  });


  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
