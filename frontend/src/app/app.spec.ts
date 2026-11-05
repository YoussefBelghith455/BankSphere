
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should display the banking layout on the dashboard', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(component.isAuthPage()).toBe(false);
    expect(element.querySelector('.app-layout')).toBeTruthy();
    expect(element.querySelector('app-sidebar')).toBeTruthy();
  });

  it('should initially close the mobile menu', () => {
    expect(component.isMenuOpen).toBe(false);
  });

  it('should toggle the mobile menu', () => {
    component.toggleMenu();

    expect(component.isMenuOpen).toBe(true);

    component.toggleMenu();

    expect(component.isMenuOpen).toBe(false);
  });
});
