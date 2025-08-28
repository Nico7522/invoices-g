import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal, resource, signal } from '@angular/core';
import { UserInfo } from '../../models/user-info';
import z from 'zod';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpClient = inject(HttpClient);

  // signal holding the user info or null
  userInfo = signal<UserInfo | null>(null);

  /**
   * Get the user info from the server
   * @returns a Observable with the user info or null
   */
  getUser(): Observable<UserInfo | null> {
    return this.#httpClient.get<{ user: UserInfo | null }>('/api/auth/user').pipe(
      map((value) => {
        if (value.user) {
          const user = this.#userSchema.parse(value.user);
          this.userInfo.set(user);
          return user;
        } else {
          this.userInfo.set(null);
          return null;
        }
      })
    );
  }

  #userSchema = z.object({
    id: z.string(),
    email: z.string(),
  });
}
