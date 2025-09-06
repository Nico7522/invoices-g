import { FormControl, FormGroup } from '@angular/forms';

export interface ClientForm {
  client: FormGroup<ClientFormGroup>;
}

export interface ClientFormGroup {
  name: FormControl<string>;
  surname: FormControl<string>;
  email: FormControl<string>;
  phoneNumber: FormControl<number>;
}
