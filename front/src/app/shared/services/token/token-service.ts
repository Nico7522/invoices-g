import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // retrieve user token from local storage
  #token = signal<string | null>(localStorage.getItem('token'));
  token = this.#token.asReadonly();

  isLoggedIn = computed(() => this.#token() !== null);

  /**
   * Set the user token in the local storage
   * @param token - The user token
   */
  setToken(token: string) {
    this.#token.set(token);
    localStorage.setItem('token', token);
  }

  /**
   * Remove the user token from the local storage
   */
  removeToken() {
    this.#token.set(null);
    localStorage.removeItem('token');
  }
}
