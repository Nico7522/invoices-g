import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = PASSWORD_REGEX.test(value);

    if (!isValid) {
      return {
        passwordStrength: {
          message:
            'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)',
          actualValue: value,
        },
      };
    }
    return null;
  };
}
