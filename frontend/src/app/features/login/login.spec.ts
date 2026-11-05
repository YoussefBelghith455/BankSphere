
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should require an email address', () => {
    component.submit();

    expect(component.loginForm.controls.email.hasError('required')).toBe(true);
    expect(component.submitted()).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    component.loginForm.controls.email.setValue('invalid-email');
    component.loginForm.controls.password.setValue('Password123');

    expect(component.loginForm.controls.email.hasError('email')).toBe(true);
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should require a password', () => {
    component.loginForm.controls.email.setValue('user@example.com');
    component.submit();

    expect(component.loginForm.controls.password.hasError('required')).toBe(true);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);

    component.togglePassword();
    expect(component.showPassword()).toBe(true);

    component.togglePassword();
    expect(component.showPassword()).toBe(false);
  });

  it('should display the backend notice for valid credentials', () => {
    component.loginForm.controls.email.setValue('user@example.com');
    component.loginForm.controls.password.setValue('Password123');

    component.submit();
    fixture.detectChanges();

    const notice = fixture.nativeElement.querySelector('.form-notice');

    expect(component.loginForm.valid).toBe(true);
    expect(notice).toBeTruthy();
    expect(notice.textContent).toContain('backend');
  });

  it('should provide a registration link', () => {
    const link = fixture.nativeElement.querySelector('.register-prompt a');

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/register');
  });

  it('should provide a forgot password link', () => {
    const link = fixture.nativeElement.querySelector('.forgot-password');

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/forgot-password');
  });
});
