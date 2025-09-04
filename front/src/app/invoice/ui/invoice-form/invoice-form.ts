import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Client } from '../../../shared/models/client-interfaces';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { CarPart } from '../../../shared/models/cart-part-interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-invoice-form',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    InputTextModule,
    InputNumber,
    SelectModule,
    ButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class InvoiceForm {
  parentContainer = inject(ControlContainer);
  readonly #destroyRef = inject(DestroyRef);
  clients = input.required<Client[]>();
  carPartsApi = input.required<CarPart[]>();
  controlKey = input.required<string>();
  label = input.required<string>();

  // Signal to calculate the total price of the car parts
  totalPartPrice = signal<number>(0);
  // Signal to calculate the total price of the car parts excl tax
  totalPriceExclTax = signal<number>(0);
  // Signal to calculate the total price of the car parts incl tax
  totalPriceInclTax = computed(() => this.totalPriceExclTax() * 1.2);

  get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup({
        clientId: new FormControl('', [Validators.required]),
        carParts: new FormArray([
          new FormGroup({
            partId: new FormControl(1, [Validators.required]),
            quantity: new FormControl('', [Validators.required]),
          }),
        ]),
        laborCostExclTax: new FormControl('', [Validators.required]),
        otherFeesExclTax: new FormControl('', [Validators.required]),
      })
    );
    this.parentFormGroup
      .get(this.controlKey())
      ?.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        this.totalPartPrice.set(
          value.carParts.reduce((acc: number, curr: { partId: string; quantity: number }) => {
            const part = this.carPartsApi().find((part) => part.id === curr.partId);
            if (part) {
              return acc + curr.quantity * part.price;
            }
            return acc;
          }, 0)
        );
        this.totalPriceExclTax.set(
          this.totalPartPrice() + value.laborCostExclTax + value.otherFeesExclTax
        );
      });
  }

  get carParts(): FormArray {
    const formGroup = this.parentFormGroup.get(this.controlKey()) as FormGroup;
    return formGroup?.get('carParts') as FormArray;
  }

  addCarPart() {
    this.carParts.push(
      new FormGroup({
        partId: new FormControl(1, [Validators.required]),
        quantity: new FormControl('', [Validators.required]),
      })
    );
  }

  removeCarPart(index: number) {
    this.carParts.removeAt(index);
  }

  constructor() {}
}
