import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';
import { ButtonModule } from 'primeng/button';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { PasswordDirective } from '../shared/directives/password-directive';
import { pipe, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user/user-service';
import { Message } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
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
    Message,
    ProgressSpinnerModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  loading = signal(false);
  login(loginForm: NgForm) {
    if (loginForm.valid) {
      this.loading.set(true);
      this.#authService
        .login(loginForm.value.email, loginForm.value.password)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.#router.navigate(['/']);
          },
        });
    }
  }
}
