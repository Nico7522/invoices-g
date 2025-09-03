import { Component, inject, input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, FloatLabel, InputTextModule, InputNumber],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class ClientForm implements OnInit {
  parentContainer = inject(ControlContainer);
  controlKey = input.required<string>();
  label = input.required<string>();

  get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup({
        name: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', [Validators.required]),
      })
    );
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey());
  }
}
