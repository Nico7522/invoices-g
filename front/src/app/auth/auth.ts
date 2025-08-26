import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth-service';
import { Session } from './models/auth-interface';
import { ButtonModule } from 'primeng/button';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { PasswordDirective } from '../shared/directives/password-directive';
@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    PasswordDirective,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  readonly #authService = inject(AuthService);
  email = signal('');
  password = signal('');
  login(loginForm: NgForm) {
    console.log(loginForm.value);
    this.#authService.login(loginForm.value.email, loginForm.value.password).subscribe((res) => {
      console.log(res);
    });
  }
}
