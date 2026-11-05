
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ForgotPassword } from './forgot-password';

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPassword],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should require an email address', () => {
    component.submit();

    expect(component.resetForm.controls.email.hasError('required')).toBe(true);
    expect(component.submitted()).toBe(false);
  });

  it('should reject an invalid email address', () => {
    component.resetForm.controls.email.setValue('invalid-email');
    component.submit();

    expect(component.resetForm.controls.email.hasError('email')).toBe(true);
    expect(component.submitted()).toBe(false);
  });

  it('should accept a valid email address', () => {
    component.resetForm.controls.email.setValue('user@example.com');
    component.submit();

    expect(component.resetForm.valid).toBe(true);
    expect(component.submitted()).toBe(true);
  });

  it('should display a validation error for an empty email', () => {
    component.submit();
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.field-error');

    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Email address is required.');
  });

  it('should display the backend notice after valid submission', () => {
    component.resetForm.controls.email.setValue('user@example.com');
    component.submit();
    fixture.detectChanges();

    const notice = fixture.nativeElement.querySelector('.form-notice');

    expect(notice).toBeTruthy();
    expect(notice.textContent).toContain('No email has been sent.');
  });

  it('should provide a link back to login', () => {
    const link = fixture.nativeElement.querySelector('.back-login a');

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/login');
  });
});
