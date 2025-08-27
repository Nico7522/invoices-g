import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Session } from '../models/auth-interface';
import { TokenService } from '../../shared/services/token/token-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #httpClient = inject(HttpClient);
  readonly #tokenService = inject(TokenService);
  /**
   * Log in the user
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns A object with the session and the user
   */
  login(email: string, password: string): Observable<Session> {
    return this.#httpClient.post<Session>('api/auth/login', { email, password }).pipe(
      tap((response) => {
        console.log(response);

        this.#tokenService.setToken(response.token.accessToken);
      })
    );
  }

  logout() {
    // TODO: Implement logout
  }
}
