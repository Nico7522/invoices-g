import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface InvoiceForm {
  invoice: FormGroup<InvoiceFormGroup>;
}

export type InvoiceFormGroup = {
  clientId: FormControl<string>;
  carParts: FormArray<FormGroup<{ partId: FormControl<string>; quantity: FormControl<number> }>>;
  laborCostExclTax: FormControl<number>;
  otherFeesExclTax: FormControl<number | null>;
};
