
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reject an empty form', () => {
    component.submit();

    expect(component.registerForm.invalid).toBe(true);
    expect(component.submitted()).toBe(false);
  });

  it('should require first and last names', () => {
    const { firstName, lastName } = component.registerForm.controls;

    expect(firstName.hasError('required')).toBe(true);
    expect(lastName.hasError('required')).toBe(true);

    firstName.setValue('J');
    lastName.setValue('D');

    expect(firstName.hasError('minlength')).toBe(true);
    expect(lastName.hasError('minlength')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    const email = component.registerForm.controls.email;

    email.setValue('invalid-email');

    expect(email.hasError('email')).toBe(true);
  });

  it('should require a strong password', () => {
    const password = component.registerForm.controls.password;

    password.setValue('short');
    expect(password.hasError('minlength')).toBe(true);

    password.setValue('password123');
    expect(password.hasError('pattern')).toBe(true);

    password.setValue('Password123');
    expect(password.valid).toBe(true);
  });

  it('should reject mismatched passwords', () => {
    component.registerForm.patchValue({
      password: 'Password123',
      confirmPassword: 'Different123'
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBe(true);
  });

  it('should require acceptance of terms', () => {
    const acceptTerms = component.registerForm.controls.acceptTerms;

    expect(acceptTerms.hasError('required')).toBe(true);

    acceptTerms.setValue(true);

    expect(acceptTerms.valid).toBe(true);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);

    component.togglePassword();
    expect(component.showPassword()).toBe(true);

    component.togglePassword();
    expect(component.showPassword()).toBe(false);
  });

  it('should toggle confirm password visibility', () => {
    expect(component.showConfirmPassword()).toBe(false);

    component.toggleConfirmPassword();
    expect(component.showConfirmPassword()).toBe(true);

    component.toggleConfirmPassword();
    expect(component.showConfirmPassword()).toBe(false);
  });

  it('should accept a valid registration form', () => {
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      acceptTerms: true
    });

    component.submit();

    expect(component.registerForm.valid).toBe(true);
    expect(component.submitted()).toBe(true);
  });

  it('should display a notice after valid submission', () => {
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      acceptTerms: true
    });

    component.submit();
    fixture.detectChanges();

    const notice = fixture.nativeElement.querySelector('.form-notice');

    expect(notice).toBeTruthy();
    expect(notice.textContent).toContain('No account has been created.');
  });

  it('should provide a link to login', () => {
    const link = fixture.nativeElement.querySelector('.login-prompt a');

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/login');
  });
});
