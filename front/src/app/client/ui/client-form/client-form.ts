import { Component, inject, input, model, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { ClientFormGroup } from '../../models/client-form-interface';
import { InputMaskModule } from 'primeng/inputmask';
@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, FloatLabel, InputTextModule, Message, InputMaskModule],
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
      new FormGroup<ClientFormGroup>({
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        surname: new FormControl('', { nonNullable: true, validators: Validators.required }),
        email: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
        phoneNumber: new FormControl(0, { nonNullable: true, validators: Validators.required }),
      })
    );
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey());
  }
}
