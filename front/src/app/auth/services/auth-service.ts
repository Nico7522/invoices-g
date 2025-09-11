import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { UserInfo } from '../../shared/models/user-info-interface';
import { UserService } from '../../shared/services/user/user-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #httpClient = inject(HttpClient);
  readonly #userService = inject(UserService);
  /**
   * Log in the user
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns A object with the user info
   */
  login(email: string, password: string): Observable<UserInfo> {
    return this.#httpClient
      .post<{ user: UserInfo }>('auth/login', { email, password })
      .pipe(map((response) => response.user));
  }

  logout() {
    return this.#httpClient
      .post('auth/logout', {})
      .pipe(tap(() => this.#userService.userInfo.set(null)));
  }
}
