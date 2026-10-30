
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { MobileHeader } from './layout/mobile-header/mobile-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, MobileHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
