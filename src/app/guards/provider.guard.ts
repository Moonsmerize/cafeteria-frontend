import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const providerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (user.rol === 'Proveedor' || user.rol === 'Admin') {
    return true;
  }

  alert('Acceso exclusivo para proveedores.');
  router.navigate(['/menu']);
  return false;
};