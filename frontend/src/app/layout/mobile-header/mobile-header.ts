
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  imports: [],
  templateUrl: './mobile-header.html',
  styleUrl: './mobile-header.scss'
})
export class MobileHeader {
  @Output() menuToggle = new EventEmitter<void>();

  toggleMenu() {
    this.menuToggle.emit();
  }
}
