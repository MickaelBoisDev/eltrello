import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLogged$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }
      router.navigateByUrl('/');
      return false;
    })
  );
};
