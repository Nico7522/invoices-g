import { Directive, forwardRef, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { passwordValidator } from '../validators/password-validator';

@Directive({
  selector: '[passwordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordDirective),
      multi: true,
    },
  ],
  standalone: true,
})
export class PasswordDirective implements Validator {
  password = input<string>('', { alias: 'passwordValidator' });
  validate(control: AbstractControl): ValidationErrors | null {
    return passwordValidator()(control);
  }
}
